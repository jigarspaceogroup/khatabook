/**
 * Prisma Client Singleton
 *
 * This module provides a singleton instance of Prisma Client to ensure
 * efficient connection pooling and prevent multiple instances in development.
 *
 * Usage:
 *   import { prisma } from '@/database/client';
 *   const users = await prisma.user.findMany();
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Extend global namespace for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Connection pool for PostgreSQL
 * Prisma 7.x requires an adapter for database connections
 */
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

/**
 * Prisma Client Configuration
 *
 * - adapter: PostgreSQL adapter (required in Prisma 7.x)
 * - log: Enable query and error logging in development
 * - errorFormat: Pretty format for better error messages in development
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: process.env['NODE_ENV'] === 'development' ? 'pretty' : 'minimal',
  });
};

/**
 * Singleton instance of Prisma Client
 *
 * In development, we use global to preserve the instance across hot reloads.
 * In production, we create a new instance.
 */
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Graceful shutdown handler
 *
 * Ensures all database connections are properly closed when the application
 * is terminated.
 */
const gracefulShutdown = async () => {
  console.log('Closing Prisma Client connections...');
  await prisma.$disconnect();
  console.log('Prisma Client disconnected');
  process.exit(0);
};

// Register shutdown handlers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

/**
 * Export types for use in the application
 */
export type { PrismaClient } from '@prisma/client';

/**
 * Export Prisma namespace for accessing generated types
 *
 * Usage:
 *   import { Prisma } from '@/database/client';
 *   const createData: Prisma.CustomerCreateInput = { ... };
 */
export { Prisma } from '@prisma/client';
