/**
 * Express Application Setup
 * Configures Express app with middleware, routes, and error handling
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/node';
import { config } from './config';
import { httpLogger, sentryContextMiddleware } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { HTTP_STATUS } from './constants/httpStatus';
import logger from './utils/logger';
import { captureException } from './utils/sentry';
import { prisma } from './database/client';

// Create Express app FIRST
const app: Application = express();

// Initialize Sentry with Express app (must be before any other middleware)
if (config.sentry?.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.app.env,
    tracesSampleRate: config.app.isProduction ? 0.1 : 1.0,
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });
  logger.info('Sentry initialized successfully', {
    environment: config.app.env,
    dsn: config.sentry.dsn.substring(0, 50) + '...',
  });
} else {
  logger.warn('Sentry is not configured (SENTRY_DSN not set). Error tracking is disabled.');
}

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// CORS configuration
app.use(
  cors({
    origin: config.app.isDevelopment
      ? '*' // Allow all origins in development
      : [
          // Production allowed origins (to be updated later)
          'https://yourdomain.com',
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware - assign unique ID to each request
app.use((req: Request, res: Response, next) => {
  req.requestId = req.get('X-Request-ID') || uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  req.startTime = Date.now();
  next();
});

// Sentry context enrichment - enriches errors with request context (if Sentry configured)
if (config.sentry?.dsn) {
  app.use(sentryContextMiddleware);
}

// HTTP request logging
app.use(httpLogger);

// API Routes

/**
 * Health Check Endpoint
 * GET /api/v1/health
 * Returns server status and uptime
 */
app.get(`/api/${config.app.apiVersion}/health`, async (req: Request, res: Response) => {
  const uptime = process.uptime();
  let databaseStatus = 'unknown';

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';
  } catch (error) {
    databaseStatus = 'disconnected';
    logger.error('Database health check failed', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      status: databaseStatus === 'connected' ? 'healthy' : 'degraded',
      uptime: Math.floor(uptime),
      timestamp: new Date().toISOString(),
      environment: config.app.env,
      version: config.app.apiVersion,
      database: databaseStatus,
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: req.requestId,
    },
  });
});

/**
 * Root endpoint
 * GET /
 * Returns API information
 */
app.get('/', (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      name: 'Khatabook Clone API',
      version: config.app.apiVersion,
      description: 'Mobile-first ledger management application for Indian small businesses',
      status: 'operational',
      documentation: '/api/docs', // To be added later
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: req.requestId,
    },
  });
});

/**
 * Sentry Test Endpoint (Development Only)
 * POST /api/v1/debug/sentry-test
 * Tests Sentry error tracking by throwing a test error
 *
 * Usage:
 * curl -X POST http://localhost:3000/api/v1/debug/sentry-test
 *
 * This endpoint is ONLY available in development and will:
 * 1. Create a test error
 * 2. Send it to Sentry (if DSN configured)
 * 3. Return the error response with Sentry event ID
 *
 * Check your Sentry dashboard for the captured error
 */
if (config.app.isDevelopment) {
  app.post(`/api/${config.app.apiVersion}/debug/sentry-test`, (req: Request, res: Response) => {
    const testErrorType = (req.body?.type || 'SENTRY_TEST_ERROR') as string;
    const errorMessage = req.body?.message || 'This is a test error from Khatabook API';

    logger.info('Sentry test endpoint called', {
      errorType: testErrorType,
      message: errorMessage,
    });

    try {
      // Capture the test error
      const eventId = captureException(
        new Error(errorMessage),
        {
          testError: true,
          errorType: testErrorType,
          timestamp: new Date().toISOString(),
          requestId: req.requestId,
        }
      );

      // Return success with Sentry event ID
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          message: 'Test error sent to Sentry',
          sentryEventId: eventId,
          errorType: testErrorType,
          dsn: config.sentry.dsn ? 'Configured' : 'Not configured',
          instructions: 'Check your Sentry dashboard for the error with ID: ' + eventId,
        },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: req.requestId,
        },
      });
    } catch (error) {
      // If Sentry test itself fails
      logger.error('Sentry test endpoint error', {
        error: error instanceof Error ? error.message : String(error),
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          message: 'Sentry test error - check logs',
          error: error instanceof Error ? error.message : String(error),
          dsn: config.sentry.dsn ? 'Configured' : 'Not configured',
          instructions: 'Review server logs for error details',
        },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: req.requestId,
        },
      });
    }
  });

  logger.debug('Sentry test endpoint registered (development only)');
}

// Module routes
import authRoutes from './modules/auth/auth.routes';

app.use(`/api/${config.app.apiVersion}/auth`, authRoutes);
// app.use(`/api/${config.app.apiVersion}/customers`, customerRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

// Sentry error handler - setup after all middleware (Sentry v10+ API)
if (config.sentry?.dsn) {
  Sentry.setupExpressErrorHandler(app);
}

// Log app initialization
logger.info('Express app initialized', {
  environment: config.app.env,
  apiVersion: config.app.apiVersion,
  cors: config.app.isDevelopment ? 'all origins' : 'restricted',
});

export default app;
