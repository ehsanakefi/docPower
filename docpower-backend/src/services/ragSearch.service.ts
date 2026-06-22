 import { PrismaClient } from '@prisma/client'; 

import { normalizePersian } from '../utils/textNormalizer';
import { PythonSearchService } from './pythonSearch.service';

const prisma = new PrismaClient();

export interface RAGSearchResult {
  chunkId: string;
  documentId: string;
  fileName: string;
  text: string;
  score: number;
}

/**
 * RAG (Retrieval-Augmented Generation) search service.
 * Uses rag chunks and delegates to Python GPU API for vector search.
 * Falls back to text search if API unavailable.
 */
export class RAGSearchService {
  private pythonService: PythonSearchService;

  constructor() {
    this.pythonService = new PythonSearchService();
  }

  async search(query: string): Promise<RAGSearchResult[]> {
    const normalizedQuery = normalizePersian(query);
    
    if (!normalizedQuery) {
      return [];
    }

    // Get RAG chunks
    const chunks = await prisma.chunk.findMany({
      where: {
        type: 'rag',
      },
    });

    if (chunks.length === 0) {
      return [];
    }

    // Try Python API for vector search
    const pythonResult = await this.pythonService.searchWithFallback({
      query: normalizedQuery,
      mode: 'rag',
      chunks: chunks.map(c => ({
        id: c.id,
        text: c.text,
        normalizedText: c.normalizedText,
      })),
    });

    let rankedChunkIds: Array<{ chunkId: string; score: number }>;

    if (pythonResult) {
      // Use Python API results (vector search + embeddings)
      rankedChunkIds = pythonResult.results;
    } else {
      // Fallback to local text-based search
      console.warn('RAG search falling back to text search (Python API unavailable)');
      rankedChunkIds = this.localTextSearch(chunks, normalizedQuery);
    }

    // Map results to chunks
    const chunkMap = new Map(chunks.map(c => [c.id, c]));

    // Get associated documents
    const documentIds = [...new Set(chunks.map(c => c.documentId))];
    const documents = await prisma.document.findMany({
      where: {
        id: {
          in: documentIds,
        },
      },
    });
    const docMap = new Map(documents.map(d => [d.id, d]));

    // Build final results
    const results: RAGSearchResult[] = rankedChunkIds
      .map(({ chunkId, score }) => {
        const chunk = chunkMap.get(chunkId);
        if (!chunk) return null;

        const doc = docMap.get(chunk.documentId);

        return {
          chunkId: chunk.id,
          documentId: chunk.documentId,
          // fileName: doc?.title || chunk.metadata.fileName,
          text: chunk.text,
          score,
        };
      })
      .filter((r): r is RAGSearchResult => r !== null);

    return results;
  }

  /**
   * Local fallback text search when vector search unavailable.
   */
  private localTextSearch(
    chunks: any[],
    query: string
  ): Array<{ chunkId: string; score: number }> {
    const queryTerms = query.toLowerCase().split(/\s+/);

    const scored = chunks.map(chunk => {
      const text = chunk.normalizedText.toLowerCase();
      
      let score = 0;
      for (const queryTerm of queryTerms) {
        if (text.includes(queryTerm)) {
          score += 10;
        }
      }

      return { chunkId: chunk.id, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
}
