from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
import hazm
import numpy as np
import logging
import threading

from database import get_db
from models import Chunk
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

from vector_index import (
    build_faiss_index,
    save_index,
    load_index,
    needs_rebuild
)

# -------------------------
# Logging
# -------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

logger = logging.getLogger("search_api")

# -------------------------
# App
# -------------------------

app = FastAPI(
    title="IR Search API",
    version="2.0"
)

# -------------------------
# Global State
# -------------------------

index = None
chunk_ids = []
bm25 = None
bm25_chunks = []

index_lock = threading.Lock()

# -------------------------
# NLP
# -------------------------

normalizer = hazm.Normalizer()
lemmatizer = hazm.Lemmatizer()


def tokenize_persian(text):

    text = normalizer.normalize(text)

    tokens = hazm.word_tokenize(text)

    result = []

    for token in tokens:

        if token.isalnum():

            lemma = lemmatizer.lemmatize(token)

            lemma = lemma.split("#")[0]

            result.append(lemma)

    return result


# -------------------------
# Embedding model
# -------------------------

embedder = SentenceTransformer(
    "intfloat/multilingual-e5-large"
)

# -------------------------
# Request models
# -------------------------

class SearchRequest(BaseModel):

    query: str
    mode: str = "hybrid"


class SearchResult(BaseModel):

    chunkId: str
    score: float


class SearchResponse(BaseModel):

    results: list[SearchResult]


# -------------------------
# BM25
# -------------------------

def bm25_search(query, top_k=10):

    global bm25
    global bm25_chunks

    tokens = tokenize_persian(query)

    scores = bm25.get_scores(tokens)

    ranked = np.argsort(scores)[::-1]

    results = []

    for idx in ranked[:top_k]:

        results.append(
            SearchResult(
                chunkId=bm25_chunks[idx].id,
                score=float(scores[idx])
            )
        )

    return results


# -------------------------
# Vector Search
# -------------------------

def vector_search(query, top_k=10):

    global index
    global chunk_ids

    if index is None:
        raise HTTPException(500, "Vector index not loaded")

    query_vector = embedder.encode(
        ["query: " + query],
        normalize_embeddings=True
    ).astype("float32")

    with index_lock:

        scores, ids = index.search(query_vector, top_k)

    results = []

    for score, idx in zip(scores[0], ids[0]):

        if idx < len(chunk_ids):

            results.append(
                SearchResult(
                    chunkId=chunk_ids[idx],
                    score=float(score)
                )
            )

    return results


# -------------------------
# Hybrid (RRF)
# -------------------------

def hybrid_search(query, top_k=10):

    bm25_results = bm25_search(query, top_k)

    vector_results = vector_search(query, top_k)

    rrf = {}

    k = 60

    for rank, item in enumerate(bm25_results, 1):

        rrf[item.chunkId] = rrf.get(item.chunkId, 0) + 1 / (k + rank)

    for rank, item in enumerate(vector_results, 1):

        rrf[item.chunkId] = rrf.get(item.chunkId, 0) + 1 / (k + rank)

    ranked = sorted(rrf.items(), key=lambda x: x[1], reverse=True)

    return [

        SearchResult(chunkId=cid, score=float(score))

        for cid, score in ranked[:top_k]

    ]


# -------------------------
# Startup
# -------------------------

@app.on_event("startup")
def load_indexes():

    global index
    global chunk_ids
    global bm25
    global bm25_chunks

    logger.info("Starting index initialization")

    db = next(get_db())

    chunks = (
        db.query(Chunk)
        .options(joinedload(Chunk.embedding))
        .filter(Chunk.type == "RETRIEVAL")
        .all()
    )

    db_count = len(chunks)

    if db_count == 0:
        logger.warning("No chunks found")
        return

    # -------- FAISS --------

    if needs_rebuild(db_count):

        logger.info("Rebuilding FAISS index")

        index, chunk_ids = build_faiss_index(chunks)

        save_index(index, chunk_ids)

    else:

        logger.info("Loading FAISS index")

        index, chunk_ids = load_index()

    # -------- BM25 --------

    corpus = [

        tokenize_persian(c.text)

        for c in chunks

    ]

    bm25 = BM25Okapi(corpus)

    bm25_chunks = chunks

    logger.info(f"Loaded {db_count} chunks")


# -------------------------
# Search endpoint
# -------------------------

@app.post(
    "/search",
    response_model=SearchResponse
)
def search(req: SearchRequest):

    if req.mode == "bm25":

        results = bm25_search(req.query)

    elif req.mode == "vector":

        results = vector_search(req.query)

    else:

        results = hybrid_search(req.query)

    return {"results": results}


# -------------------------
# Rebuild endpoint
# -------------------------

@app.post("/rebuild-index")
def rebuild_index(db: Session = Depends(get_db)):

    global index
    global chunk_ids

    logger.info("Manual index rebuild requested")

    chunks = (
        db.query(Chunk)
        .options(joinedload(Chunk.embedding))
        .filter(Chunk.type == "RETRIEVAL")
        .all()
    )

    index, chunk_ids = build_faiss_index(chunks)

    save_index(index, chunk_ids)

    return {"status": "rebuilt", "chunks": len(chunk_ids)}
