import { Router } from 'express';
import { addDocument, getDocuments, getDocumentById, updateDocument, deleteDocument } from '../controllers/document.controller';

const router = Router();

// Admin routes for document management
router.post('/', addDocument);       // POST /api/admin/documents
router.get('/', getDocuments);       // GET /api/documents
router.get('/:id', getDocumentById); // GET /api/documents/:id
router.put('/:id', updateDocument);  // PUT /api/documents/:id
router.delete('/:id', deleteDocument); // DELETE /api/documents/:id

export default router;