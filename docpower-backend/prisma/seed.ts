import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const viewerPassword = await bcrypt.hash("viewer123", 10);
  const editorPassword = await bcrypt.hash("editor123", 10);
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'viewer',
      password: viewerPassword,
      role: 'VIEWER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'editor',
      password: editorPassword,
      role: 'EDITOR',
    },
  });
  console.log("Users created");

  const docs = await prisma.document.createMany({
    data: [
      {
        title: 'Introduction to Node.js',
        doc_code: 'NODE101',
        issue_date: new Date('2023-01-01'),
      },
      {
        title: 'Understanding PostgreSQL',
        doc_code: 'PGSQL101',
        issue_date: new Date('2023-02-01')  ,
      },
      {
        title: 'Prisma ORM Guide',
        doc_code: 'PRISMA101',
        issue_date: new Date('2023-03-01'),
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