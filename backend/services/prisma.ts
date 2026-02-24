import { PrismaClient } from "@prisma/client";

// Shared PrismaClient instance to be used across the entire application.
// This prevents connection pool exhaustion in production (Supabase/Render).
export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Graceful shutdown
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});
