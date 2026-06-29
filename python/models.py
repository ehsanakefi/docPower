from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    ForeignKey,
    Float,
    Index
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import ARRAY


Base = declarative_base()


# -------------------------
# Chunk Table
# -------------------------

class Chunk(Base):

    __tablename__ = "chunks"

    id = Column(String, primary_key=True)

    versionId = Column(String, index=True)

    documentId = Column(String, index=True)

    pageNumber = Column(Integer)

    chunkIndex = Column(Integer)

    type = Column(String, index=True)

    text = Column(Text)

    normalizedText = Column(Text)

    # Relation to Embedding
    embedding = relationship(
        "Embedding",
        back_populates="chunk",
        uselist=False,
        cascade="all, delete"
    )
 
class Embedding(Base):

    __tablename__ = "embeddings"

    id = Column(String, primary_key=True)

    chunkId = Column(
        String,
        ForeignKey("chunks.id", ondelete="CASCADE"),
        unique=True,
        index=True
    )

    # اگر از PostgreSQL استفاده می‌کنی
    vector = Column(ARRAY(Float))

    model = Column(String)

    chunk = relationship(
        "Chunk",
        back_populates="embedding"
    )
