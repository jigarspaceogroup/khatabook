/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

import http from 'http';
import app from './app';
import { config } from './config';
import logger from './utils/logger';

// Create HTTP server
const server = http.createServer(app);

// Server port
const PORT = config.app.port;

/**
 * Start server
 */
const startServer = (): void => {
  server.listen(PORT, () => {
    logger.info(`Server started successfully`, {
      port: PORT,
      environment: config.app.env,
      nodeVersion: process.version,
      processId: process.pid,
    });

    logger.info(`Health check available at: http://localhost:${PORT}/api/${config.app.apiVersion}/health`);
  });
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = (signal: string): void => {
  logger.info(`${signal} signal received: closing server gracefully`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown', { error: err });
      process.exit(1);
    }

    logger.info('Server closed successfully');

    // Close database connections here (Phase 1)
    // await prisma.$disconnect();

    // Close Redis connection here (Phase 1)
    // await redis.disconnect();

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection', {
    reason,
  });
  process.exit(1);
});

/**
 * Handle graceful shutdown signals
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();
