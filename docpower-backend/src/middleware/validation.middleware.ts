import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateDocumentCreation = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('doc_code').isString().notEmpty().withMessage('Document code is required'),
  body('issue_date').isDate().withMessage('Issue date must be a valid date'),
  body('file_url').isURL().withMessage('File URL must be a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSearchQuery = [
  body('title').optional().isString().withMessage('Title must be a string'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];