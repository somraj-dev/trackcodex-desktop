import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { username: true, name: true, email: true },
      take: 10
    });
    console.log(`Total users in DB: ${count}`);
    console.log('Sample users:', JSON.stringify(users, null, 2));
  } catch (err: any) {
    console.error('Error querying DB:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
