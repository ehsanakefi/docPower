// Using mock Prisma client for development
 import { PrismaClient } from '@prisma/client'; 

export const prisma = new PrismaClient();
export interface CreateDocumentData {
  title: string;
  doc_code: string;
  issue_date: string; // Jalali date as string
  file_url: string; 
  sections?: CreateSectionData[];
}

export interface CreateSectionData {
  title: string;
  section_type?: string;
  order_index?: number;
}

export class DocumentService {
  async addDocument(data: CreateDocumentData) {
    try {
      // Separate sections from document data
      const { sections, ...documentData } = data;
      
      // Create document
      const document = await prisma.document.create({
        data: documentData,
        include: {
          sections: true,
        },
      });

      // Create sections if provided
      if (sections && sections.length > 0) {
        await prisma.documentSection.createMany({
          data: sections.map((section, index) => ({
            document_id: document.id,
            title: section.title,
            section_type: section.section_type || 'section',
            order_index: section.order_index || index + 1,
          })),
        });

        // Fetch document with sections
        return await prisma.document.findUnique({
          where: { id: document.id },
          include: {
            sections: {
              orderBy: { order_index: 'asc' },
            },
          },
        });
      }

      return document;
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document');
    }
  }

  async getDocumentById(id: string) {
    try {
      return await prisma.document.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order_index: 'asc' },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error('Failed to fetch document');
    }
  }

  async getDocuments() {
    try {
      return await prisma.document.findMany({
        include: {
          sections: {
            orderBy: { order_index: 'asc' },
          },
        },
        orderBy: {
          issue_date: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  async updateDocument(id: string, data: Partial<CreateDocumentData>) {
    try {
      const { sections, ...documentData } = data;
      
      // Update document
      const document = await prisma.document.update({
        where: { id },
        data: documentData,
      });

      // If sections are provided, replace existing sections
      if (sections !== undefined) {
        // Delete existing sections
        await prisma.documentSection.deleteMany({
          where: { document_id: id },
        });

        // Create new sections
        if (sections.length > 0) {
          await prisma.documentSection.createMany({
            data: sections.map((section, index) => ({
              document_id: id,
              title: section.title,
              section_type: section.section_type || 'section',
              order_index: section.order_index || index + 1,
            })),
          });
        }
      }

      // Return updated document with sections
      return await prisma.document.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order_index: 'asc' },
          },
        },
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  async deleteDocument(id: string) {
    try {
      // Sections will be deleted automatically due to CASCADE
      return await prisma.document.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }
}