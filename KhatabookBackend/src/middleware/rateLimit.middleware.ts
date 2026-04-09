/**
 * Rate Limiting Middleware
 * Protects against abuse using Redis counters
 */

import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/cache/RedisService';
import { HTTP_STATUS } from '../constants/httpStatus';
import logger from '../utils/logger';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  keyGenerator: (req: Request) => string; // Generate rate limit key
  handler?: (req: Request, res: Response) => void; // Custom handler on limit exceeded
}

/**
 * Create rate limiter middleware
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = `ratelimit:${config.keyGenerator(req)}`;
      const windowSeconds = Math.floor(config.windowMs / 1000);

      // Increment counter
      const current = await redisService.incr(key);

      // Set expiry on first request in window
      if (current === 1) {
        await redisService.expire(key, windowSeconds);
      }

      // Get TTL for retry-after header
      const ttl = await redisService.ttl(key);
      const remaining = Math.max(0, config.max - current);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl * 1000).toISOString());

      // Check if limit exceeded
      if (current > config.max) {
        logger.warn('Rate limit exceeded', {
          key,
          current,
          max: config.max,
          ip: req.ip,
          path: req.path,
          requestId: req.requestId,
        });

        if (config.handler) {
          config.handler(req, res);
          return;
        }

        res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            timestamp: new Date().toISOString(),
            path: req.path,
            request_id: req.requestId,
            retry_after: ttl,
          },
        });
        return;
      }

      next();
    } catch (error) {
      // On Redis error, allow request (fail open)
      logger.error('Rate limiting error', {
        error: error instanceof Error ? error.message : String(error),
        path: req.path,
        requestId: req.requestId,
      });
      next();
    }
  };
};

/**
 * Rate limiter for OTP send endpoint
 * 5 requests per hour per phone number
 */
export const otpSendLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req: Request) => {
    const phoneNumber = req.body.phone_number || 'unknown';
    return `otp:send:${phoneNumber}`;
  },
  handler: (req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: 'OTP_RATE_LIMIT_EXCEEDED',
        message: 'Too many OTP requests. Please try again after 1 hour.',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  },
});

/**
 * Rate limiter for OTP verify endpoint
 * 10 requests per hour per phone number
 */
export const otpVerifyLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req: Request) => {
    const phoneNumber = req.body.phone_number || 'unknown';
    return `otp:verify:${phoneNumber}`;
  },
  handler: (req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: 'OTP_VERIFY_RATE_LIMIT_EXCEEDED',
        message: 'Too many verification attempts. Please try again after 1 hour.',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  },
});

/**
 * Global rate limiter
 * 100 requests per 15 minutes per user
 */
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req: Request) => {
    const userId = req.user?.id || req.ip || 'anonymous';
    return `global:${userId}`;
  },
});
