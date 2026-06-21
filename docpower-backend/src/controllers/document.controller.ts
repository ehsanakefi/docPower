import { Request, Response } from 'express';
import { DocumentService, CreateDocumentData } from '../services/document.service';

const documentService = new DocumentService();

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

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }
    
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