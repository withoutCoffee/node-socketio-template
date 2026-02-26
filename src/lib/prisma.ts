import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globlalForPrisma = global as unknown as { prisma: PrismaClient };
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

export const prisma =
  globlalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globlalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown
 */
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
