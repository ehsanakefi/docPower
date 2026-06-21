import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123', // In a real application, ensure to hash passwords
      role: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user',
      password: 'user123', // In a real application, ensure to hash passwords
      role: 'user',
    },
  });

  // Seed documents
  await prisma.document.createMany({
    data: [
      {
        title: 'Introduction to Node.js',
        doc_code: 'NODE101',
        issue_date: new Date('2023-01-01'),
        file_url: 'http://example.com/docs/node-intro.pdf',
      },
      {
        title: 'Understanding PostgreSQL',
        doc_code: 'PGSQL101',
        issue_date: new Date('2023-02-01'),
        file_url: 'http://example.com/docs/postgresql-guide.pdf',
      },
      {
        title: 'Prisma ORM Guide',
        doc_code: 'PRISMA101',
        issue_date: new Date('2023-03-01'),
        file_url: 'http://example.com/docs/prisma-guide.pdf',
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });