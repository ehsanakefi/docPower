 import { PrismaClient } from '@prisma/client'; 

import { splitParagraphs, normalizePersian } from '../utils/textNormalizer';
import { createAllChunks } from '../utils/chunker';

const prisma = new PrismaClient();

export interface DocumentIngestionInput {
  versionId: string;
  documentId: string;
  fileName: string;
  rawText: string;
}

export interface IngestionResult {
  documentId: string;
  paragraphCount: number;
  chunkCount: number;
  chunksByType: {
    paragraph: number;
    retrieval: number;
    rag: number;
  };
}

/**
 * Full ingestion pipeline:
 * 1. Normalize the raw text
 * 2. Split into paragraphs
 * 3. Create all chunk types (paragraph, retrieval, rag)
 * 4. Store chunks in database
 */
export class DocumentIngestionService {
  async ingestDocument(input: DocumentIngestionInput): Promise<IngestionResult> {
    const { documentId, fileName, rawText, versionId } = input;

    // Step 1: Normalize
    const normalizedText = normalizePersian(rawText);

    // Step 2: Split into paragraphs
    const paragraphs = splitParagraphs(normalizedText);

    if (paragraphs.length === 0) {
      throw new Error('No paragraphs found in document');
    }

    // Step 3: Create chunks
    const uploadDate = new Date().toISOString();
    const allChunks = createAllChunks(paragraphs, documentId, fileName, uploadDate, versionId);

    // Step 4: Store chunks
    await prisma.chunk.createMany({
      data: allChunks,
    });

    // Compute statistics
    const chunksByType = {
      paragraph: allChunks.filter(c => c.type === 'PARAGRAPH').length,
      retrieval: allChunks.filter(c => c.type === 'RETRIEVAL').length,
      rag: allChunks.filter(c => c.type === 'RAG').length,
    };

    return {
      documentId,
      paragraphCount: paragraphs.length,
      chunkCount: allChunks.length,
      chunksByType,
    };
  }

  /**
   * Delete all chunks for a document (cleanup when document is deleted).
   */
  async deleteDocumentChunks(documentId: string): Promise<void> {
    await prisma.chunk.deleteMany({
      where: { documentId },
    });
  }

  /**
   * Get chunk statistics for a document.
   */
  async getDocumentChunkStats(documentId: string): Promise<any> {
    const chunks = await prisma.chunk.findMany({
      where: { documentId },
    });

    return {
      total: chunks.length,
      byType: {
        paragraph: chunks.filter(c => c.type === 'PARAGRAPH').length,
        retrieval: chunks.filter(c => c.type === 'RETRIEVAL').length,
        rag: chunks.filter(c => c.type === 'RAG').length,
      },
    };
  }
}
