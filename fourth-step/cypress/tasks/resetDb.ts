import { PrismaClient } from "@prisma/client";

export default async function resetDb() {
    // Should probably use the same configuration, i.e. the same instance from db/client
    // But have some trouble with .env files in cypress
    const prisma = new PrismaClient();

    await prisma.$transaction([
        prisma.todo.deleteMany(),
        prisma.todoClear.deleteMany(),
    ]);

    await prisma.$disconnect();

    return null;
}

