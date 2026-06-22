import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user',
      password: userPassword,
      role: 'user',
    },
  });

  console.log("Users created");

  const docs = await prisma.document.createMany({
    data: [
      {
        title: 'Introduction to Node.js',
        doc_code: 'NODE101',
        issue_date: '2023-01-01',
        file_url: 'http://example.com/docs/node-intro.pdf',
      },
      {
        title: 'Understanding PostgreSQL',
        doc_code: 'PGSQL101',
        issue_date: '2023-02-01',
        file_url: 'http://example.com/docs/postgresql-guide.pdf',
      },
      {
        title: 'Prisma ORM Guide',
        doc_code: 'PRISMA101',
        issue_date: '2023-03-01',
        file_url: 'http://example.com/docs/prisma-guide.pdf',
      },
    ],
  });

  console.log("Documents created:", docs.count);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });