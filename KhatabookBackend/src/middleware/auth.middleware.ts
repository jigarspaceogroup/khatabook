/**
 * Auth Middleware
 * Handles JWT authentication and user context
 */

import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../utils/logger';

/**
 * Authenticate JWT Token
 * Extracts and verifies JWT from Authorization header
 * Sets req.user with decoded user info
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header', {
        path: req.path,
        requestId: req.requestId,
      });

      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization token',
          timestamp: new Date().toISOString(),
          path: req.path,
          request_id: req.requestId,
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Set user context in request
    req.user = {
      id: decoded.userId,
      phoneNumber: decoded.phoneNumber,
    };

    logger.debug('Token authenticated successfully', {
      userId: decoded.userId,
      path: req.path,
      requestId: req.requestId,
    });

    next();
  } catch (error) {
    logger.warn('Token authentication failed', {
      error: error instanceof Error ? error.message : String(error),
      path: req.path,
      requestId: req.requestId,
    });

    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    const isExpired = errorMessage.includes('expired');

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * Optional Authentication
 * Same as authenticateToken but doesn't fail if token is missing
 * Used for endpoints that work for both authenticated and unauthenticated users
 */
export const optionalAuthentication = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user context
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        phoneNumber: decoded.phoneNumber,
      };

      logger.debug('Optional auth: Token authenticated', {
        userId: decoded.userId,
        path: req.path,
        requestId: req.requestId,
      });
    } catch (tokenError) {
      // Invalid token, but continue without user context
      logger.debug('Optional auth: Invalid token, continuing without user', {
        path: req.path,
        requestId: req.requestId,
      });
    }

    next();
  } catch (error) {
    // Any other error, continue without user context
    logger.error('Optional auth middleware error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });
    next();
  }
};
