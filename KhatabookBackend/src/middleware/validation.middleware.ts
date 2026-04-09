/**
 * Validation Middleware
 * Validates request data using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../utils/logger';

/**
 * Validate request body against Zod schema
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate and parse request body
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Validation failed', {
          path: req.path,
          errors,
          requestId: req.requestId,
        });

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: errors,
            timestamp: new Date().toISOString(),
            path: req.path,
            request_id: req.requestId,
          },
        });
        return;
      }

      // Replace request body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      logger.error('Validation middleware error', {
        error: error instanceof Error ? error.message : String(error),
        requestId: req.requestId,
      });

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation error occurred',
          timestamp: new Date().toISOString(),
          path: req.path,
          request_id: req.requestId,
        },
      });
    }
  };
};
