 import { PrismaClient } from '@prisma/client'; 

import { normalizePersian } from '../utils/textNormalizer';
import { PythonSearchService } from './pythonSearch.service';

const prisma = new PrismaClient();

export interface IRSearchResult {
  chunkId: string;
  documentId: string;
  fileName: string;
  documentTitle: string;
  text: string;
  snippet: string;
  score: number;
}

/**
 * IR (Information Retrieval) search service.
 * Uses retrieval chunks and delegates to Python GPU API for BM25/TF-IDF.
 * Falls back to local search if API unavailable.
 */
export class IRSearchService {
  private pythonService: PythonSearchService;

  constructor() {
    this.pythonService = new PythonSearchService();
  }

  async search(query: string): Promise<IRSearchResult[]> {
    const normalizedQuery = normalizePersian(query);
    
    if (!normalizedQuery) {
      return [];
    }

    // Get retrieval chunks
    // const chunks = await prisma.chunk.findMany({
    //   where: {
    //     type: 'RETRIEVAL',
    //   },
    // });

    // if (chunks.length === 0) {
    //   return [];
    // }

    // Try Python API
    const pythonResult = await this.pythonService.searchWithFallback({
      query: normalizedQuery,
      mode: 'ir',
      // chunks: chunks.map(c => ({
      //   id: c.id,
      //   text: c.text,
      //   normalizedText: c.normalizedText,
      // })),
    });
    let rankedChunkIds: Array<{ chunkId: string; score: number }>;
let chunks;


if (pythonResult) {

    console.log(
      'Python API result:',
      pythonResult
    );


    rankedChunkIds = pythonResult.results;


    const chunkIds = rankedChunkIds.map(
      r => r.chunkId
    );


    chunks = await prisma.chunk.findMany({

      where:{
        id:{
          in:chunkIds
        }
      }

    });


}
else {


    chunks = await prisma.chunk.findMany({

      where:{
        type:'RETRIEVAL'
      }

    });


    rankedChunkIds =
      this.localIRSearch(
        chunks,
        normalizedQuery
      );

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
    const results: IRSearchResult[] = rankedChunkIds
      .map(({ chunkId, score }) => {
        const chunk = chunkMap.get(chunkId);
        if (!chunk) return null;

        const doc = docMap.get(chunk.documentId);
        const snippet = this.createSnippet(chunk.text, normalizedQuery);

        return {
          chunkId: chunk.id,
          documentId: chunk.documentId,
          documentTitle: doc?.title ? doc.title : chunk.metadata? chunk.metadata.fileName || "Unknown Document": "Unknown Document",
          text: chunk.text,
          snippet,
          score,
        };
      })
      .filter((r): r is IRSearchResult => r !== null);

    return results;
  }

  /**
   * Local fallback IR implementation (simplified BM25).
   */
  private localIRSearch(
    chunks: any[],
    query: string
  ): Array<{ chunkId: string; score: number }> {
    const queryTerms = query.toLowerCase().split(/\s+/);

    const scored = chunks.map(chunk => {
      const text = chunk.normalizedText.toLowerCase();
      const terms = text.split(/\s+/);

      let score = 0;

      for (const queryTerm of queryTerms) {
        const termFreq = terms.filter((t: string) => t.includes(queryTerm)).length;
        score += termFreq * Math.log(1 + chunks.length / (1 + termFreq));
      }

      return { chunkId: chunk.id, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }

  private createSnippet(text: string, query: string, contextLength: number = 150): string {
    const normalizedText = normalizePersian(text);
    const index = normalizedText.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) {
      return text.substring(0, contextLength) + '...';
    }

    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(text.length, index + query.length + contextLength / 2);

    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }
}
