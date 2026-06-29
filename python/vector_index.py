# import faiss
# import numpy as np

# def build_faiss_index(chunks):

#     vectors = []
#     ids = []

#     for c in chunks:

#         if c.embedding:

#             vectors.append(c.embedding.vector)
#             ids.append(c.id)

#     vectors = np.array(vectors).astype("float32")
#     if len(vectors) == 0:
#         raise ValueError("No embeddings found to build FAISS index")
#     dimension = vectors.shape[1]

#     index = faiss.IndexFlatIP(dimension)

#     index.add(vectors)

#     return index, ids
import faiss
import numpy as np
import json
import os
import logging

logger = logging.getLogger("vector_index")

INDEX_PATH = "faiss_index/index.faiss"
META_PATH = "faiss_index/index_meta.json"


def build_faiss_index(chunks):

    vectors = []
    ids = []

    for c in chunks:

        if c.embedding and c.embedding.vector:

            vectors.append(c.embedding.vector)
            ids.append(c.id)

    if len(vectors) == 0:
        raise ValueError("No embeddings available")

    vectors = np.array(vectors).astype("float32")

    dimension = vectors.shape[1]

    nlist = int(np.sqrt(len(vectors)))

    logger.info(f"Building IVF index (nlist={nlist})")

    quantizer = faiss.IndexFlatIP(dimension)

    index = faiss.IndexIVFFlat(
        quantizer,
        dimension,
        nlist,
        faiss.METRIC_INNER_PRODUCT
    )

    index.train(vectors)

    index.add(vectors)

    index.nprobe = max(10, nlist // 20)

    return index, ids


def save_index(index, ids):

    os.makedirs("faiss_index", exist_ok=True)

    faiss.write_index(index, INDEX_PATH)

    meta = {
        "size": len(ids),
        "ids": ids
    }

    with open(META_PATH, "w") as f:
        json.dump(meta, f)

    logger.info("FAISS index saved")


def load_index():

    if not os.path.exists(INDEX_PATH):
        return None, None

    index = faiss.read_index(INDEX_PATH)

    with open(META_PATH) as f:
        meta = json.load(f)

    ids = meta["ids"]

    logger.info("FAISS index loaded")

    return index, ids


def needs_rebuild(db_count):

    if not os.path.exists(META_PATH):
        return True

    with open(META_PATH) as f:
        meta = json.load(f)

    return meta["size"] != db_count
