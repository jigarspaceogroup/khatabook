/**
 * Express type extensions
 * Extend Express Request interface with custom properties
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      /**
       * Unique request ID (UUID) generated for each request
       * Used for logging and error tracking
       */
      requestId: string;

      /**
       * Authenticated user information
       * Added by auth middleware
       */
      user?: {
        id: string;
        phoneNumber: string;
      };

      /**
       * Request start time (for performance tracking)
       */
      startTime?: number;
    }
  }
}

export {};
