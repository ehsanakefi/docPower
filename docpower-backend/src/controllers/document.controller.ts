import { Request, Response } from 'express';
import { DocumentService, CreateDocumentData } from '../services/document.service';
import { DocumentIngestionService } from '../services/documentIngestion.service';
import { extractTextFromDocx } from '../utils/docxExtractor';
import multer, { FileFilterCallback } from 'multer';

const documentService = new DocumentService();
const ingestionService = new DocumentIngestionService();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname.endsWith('.docx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  },
});

export const uploadMiddleware = upload.single('file');

export const addDocument = async (req: Request, res: Response) => {
  try {
    const { title, doc_code, issue_date, file_url, sections }: CreateDocumentData = req.body;
    
    // Validate required fields
    if (!title || !doc_code || !issue_date || !file_url) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required: title, doc_code, issue_date, file_url' 
      });
    }

    // Validate sections if provided
    if (sections && Array.isArray(sections)) {
      for (const section of sections) {
        if (!section.title) {
          return res.status(400).json({
            success: false,
            message: 'Each section must have a title'
          });
        }
      }
    }

    const newDocument = await documentService.addDocument({ 
      title, 
      doc_code, 
      issue_date, 
      file_url,
      sections: sections || []
    });
    
    res.status(201).json({
      success: true,
      message: 'Document added successfully',
      data: newDocument
    });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding document', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await documentService.getDocuments();
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving documents', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }
    
    const document = await documentService.getDocumentById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving document', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<CreateDocumentData> = req.body;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }
    
    const updatedDocument = await documentService.updateDocument(id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: updatedDocument
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating document', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Upload and process a .docx document with full ingestion pipeline.
 * 
 * POST /api/documents/upload
 * Content-Type: multipart/form-data
 * 
 * Fields:
 *  - file: .docx file
 *  - title: document title
 *  - doc_code: document code
 *  - issue_date: Jalali date
 */
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, doc_code, issue_date } = req.body;

    // Validate file
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Validate required fields
    if (!title || !doc_code || !issue_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, doc_code, issue_date',
      });
    }

    // Step 1: Extract text from .docx
    const rawText = await extractTextFromDocx(file.buffer);

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No text content found in document',
      });
    }

    // Step 2: Create document record
    const document = await documentService.addDocument({
      title,
      doc_code,
      issue_date,
      file_url: `/uploads/${file.originalname}`,
    });

    if (!document) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create document record',
      });
    }

    // Step 3: Run ingestion pipeline (normalize, chunk, store)
    const ingestionResult = await ingestionService.ingestDocument({
      documentId: document.id,
      fileName: file.originalname,
      rawText,
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        document,
        ingestion: ingestionResult,
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }
    
    // Delete associated chunks
    await ingestionService.deleteDocumentChunks(id);
    
    await documentService.deleteDocument(id);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting document', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
