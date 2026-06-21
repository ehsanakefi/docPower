import { normalizePersian } from './textNormalizer';

export type ChunkType = 'paragraph' | 'retrieval' | 'rag';

export interface ChunkData {
  documentId: string;
  chunkIndex: number;
  type: ChunkType;
  text: string;
  normalizedText: string;
  paragraphStart: number;
  paragraphEnd: number;
  charLength: number;
  metadata: {
    fileName: string;
    uploadDate: string;
  };
}

interface ChunkConfig {
  minSize: number;
  maxSize: number;
  overlap: number;
}

const RETRIEVAL_CONFIG: ChunkConfig = {
  minSize: 300,
  maxSize: 1500,
  overlap: 1,
};

const RAG_CONFIG: ChunkConfig = {
  minSize: 800,
  maxSize: 2500,
  overlap: 1,
};

/**
 * Build paragraph chunks (1:1 mapping to paragraphs).
 */
function buildParagraphChunks(
  paragraphs: string[],
  documentId: string,
  fileName: string,
  uploadDate: string,
): ChunkData[] {
  return paragraphs.map((text, index) => ({
    documentId,
    chunkIndex: index,
    type: 'paragraph' as ChunkType,
    text,
    normalizedText: normalizePersian(text),
    paragraphStart: index,
    paragraphEnd: index,
    charLength: text.length,
    metadata: { fileName, uploadDate },
  }));
}

/**
 * Generic windowed chunk builder with configurable size and overlap.
 */
function buildWindowedChunks(
  paragraphs: string[],
  documentId: string,
  fileName: string,
  uploadDate: string,
  type: ChunkType,
  config: ChunkConfig,
): ChunkData[] {
  const chunks: ChunkData[] = [];
  let chunkIndex = 0;
  let start = 0;

  while (start < paragraphs.length) {
    let end = start;
    let combinedText = paragraphs[start];

    while (end + 1 < paragraphs.length && combinedText.length < config.minSize) {
      end++;
      combinedText += '\n\n' + paragraphs[end];
    }

    while (
      end + 1 < paragraphs.length &&
      (combinedText + '\n\n' + paragraphs[end + 1]).length <= config.maxSize
    ) {
      end++;
      combinedText += '\n\n' + paragraphs[end];
    }

    chunks.push({
      documentId,
      chunkIndex,
      type,
      text: combinedText,
      normalizedText: normalizePersian(combinedText),
      paragraphStart: start,
      paragraphEnd: end,
      charLength: combinedText.length,
      metadata: { fileName, uploadDate },
    });

    chunkIndex++;
    start = Math.max(start + 1, end + 1 - config.overlap);
  }

  return chunks;
}

/**
 * Run the full chunking pipeline on an array of paragraphs.
 * Returns all three chunk types in a single flat array.
 */
export function createAllChunks(
  paragraphs: string[],
  documentId: string,
  fileName: string,
  uploadDate: string,
): ChunkData[] {
  if (paragraphs.length === 0) return [];

  const paragraphChunks = buildParagraphChunks(paragraphs, documentId, fileName, uploadDate);
  const retrievalChunks = buildWindowedChunks(
    paragraphs, documentId, fileName, uploadDate, 'retrieval', RETRIEVAL_CONFIG,
  );
  const ragChunks = buildWindowedChunks(
    paragraphs, documentId, fileName, uploadDate, 'rag', RAG_CONFIG,
  );

  return [...paragraphChunks, ...retrievalChunks, ...ragChunks];
}
