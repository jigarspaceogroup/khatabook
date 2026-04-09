/**
 * Error Handling Middleware
 * Centralized error handling with standard error response format
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { HTTP_STATUS } from '../constants/httpStatus';
import { config } from '../config';

/**
 * Standard error response format
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
    timestamp: string;
    path: string;
    request_id: string;
    stack?: string;
  };
}

/**
 * Custom Application Error class
 */
export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: unknown[];

  constructor(
    code: string,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: unknown[]
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handling middleware
 * Catches all errors and returns standardized error response
 */
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Default error values
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: unknown[] | undefined;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
  }
  // Handle generic errors
  else if (err instanceof Error) {
    message = err.message;
  }

  // Log error with context
  logger.error('Error occurred', {
    error: errorCode,
    message: message,
    statusCode,
    path: req.path,
    method: req.method,
    requestId: req.requestId,
    details,
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.path,
      request_id: req.requestId,
    },
  };

  // Include details if present
  if (details && details.length > 0) {
    errorResponse.error.details = details;
  }

  // Include stack trace in development
  if (config.app.isDevelopment && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      path: req.path,
      request_id: req.requestId,
    },
  };

  res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
