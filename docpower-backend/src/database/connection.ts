// Using mock Prisma client for development
// Replace with: import { PrismaClient } from '@prisma/client'; once database is set up
import { MockPrismaClient } from '../services/mock-prisma';

const prisma = new MockPrismaClient();

const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully (using mock data for development).');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export { prisma, connectToDatabase };