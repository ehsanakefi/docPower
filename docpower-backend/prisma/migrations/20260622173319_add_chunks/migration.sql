-- CreateTable
CREATE TABLE "Chunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "normalizedText" TEXT NOT NULL,
    "paragraphStart" INTEGER NOT NULL,
    "paragraphEnd" INTEGER NOT NULL,
    "charLength" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,
    "embedding" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Chunk_documentId_idx" ON "Chunk"("documentId");
