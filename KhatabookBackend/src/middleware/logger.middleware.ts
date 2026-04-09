/**
 * Logger Middleware
 * HTTP request logging using Morgan with Winston integration
 *
 * Features:
 * - Automatic HTTP request/response logging
 * - Request ID tracking
 * - Response time measurement
 * - Colored output in development
 * - JSON format in production
 * - Sentry integration for error tracking
 */

import express from 'express';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { morganStream } from '../utils/logger';
import { config } from '../config';

// Define custom Morgan token for request ID
morgan.token('request-id', (req: express.Request) => {
  return req.requestId || '-';
});

// Development format: colored output with more details
const developmentFormat =
  ':method :url :status :response-time ms - :request-id - :res[content-length]';

// Production format: JSON format for structured logging
const productionFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :request-id';

// Choose format based on environment
const format = config.app.isDevelopment ? developmentFormat : productionFormat;

// Create Morgan middleware
export const httpLogger = morgan(format, {
  stream: morganStream,
  skip: (req) => {
    // Skip logging for health check endpoint in production
    if (config.app.isProduction && req.url === `/api/${config.app.apiVersion}/health`) {
      return true;
    }
    return false;
  },
});

/**
 * Sentry Context Enrichment Middleware
 * Enriches Sentry events with HTTP request context
 *
 * Attaches to every request:
 * - HTTP method and URL
 * - Request ID
 * - User IP address
 * - Response status code
 * - Response time
 */
export const sentryContextMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Attach request context to Sentry scope
  Sentry.withScope((scope) => {
    scope.setTag('http.method', req.method);
    scope.setTag('http.url', req.url);
    scope.setContext('request', {
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.get('user-agent'),
        'content-type': req.get('content-type'),
      },
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      requestId: req.requestId,
    });

    // Capture response time after response is sent
    const originalSend = res.send;
    res.send = function (data: any) {
      const duration = Date.now() - (req.startTime || Date.now());
      scope.setTag('http.status_code', res.statusCode);
      scope.setContext('response', {
        statusCode: res.statusCode,
        duration: duration,
        durationMs: `${duration}ms`,
      });
      return originalSend.call(this, data);
    };
  });

  next();
};
