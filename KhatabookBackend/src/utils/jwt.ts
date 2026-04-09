/**
 * JWT Utility Functions
 * Handles JWT token generation and verification for authentication
 */

import jwt from 'jsonwebtoken';
import { config } from '../config';

/**
 * JWT Payload Interface
 */
export interface JwtPayload {
  userId: string;
  phoneNumber: string;
  deviceId?: string; // For access tokens
  sessionId?: string; // For refresh tokens
  type: 'access' | 'refresh';
}

/**
 * Generate Access Token (24h expiry)
 * Used for API authentication
 */
export const generateAccessToken = (
  userId: string,
  phoneNumber: string,
  deviceId: string
): string => {
  const secret = config.jwt.secret;
  const expiry = config.jwt.accessTokenExpiry;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  if (!expiry) {
    throw new Error('JWT_ACCESS_TOKEN_EXPIRY is not configured');
  }

  const payload: JwtPayload = {
    userId,
    phoneNumber,
    deviceId,
    type: 'access',
  };

  return jwt.sign(payload as object, secret, {
    expiresIn: expiry as any,
  });
};

/**
 * Generate Refresh Token (30d expiry)
 * Used for obtaining new access tokens
 */
export const generateRefreshToken = (
  userId: string,
  phoneNumber: string,
  sessionId: string
): string => {
  const secret = config.jwt.refreshSecret;
  const expiry = config.jwt.refreshTokenExpiry;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  if (!expiry) {
    throw new Error('JWT_REFRESH_TOKEN_EXPIRY is not configured');
  }

  const payload: JwtPayload = {
    userId,
    phoneNumber,
    sessionId,
    type: 'refresh',
  };

  return jwt.sign(payload as object, secret, {
    expiresIn: expiry as any,
  });
};

/**
 * Verify Access Token
 * Returns decoded payload or throws error
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    if (!config.jwt.secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify Refresh Token
 * Returns decoded payload or throws error
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    if (!config.jwt.refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Calculate token expiration time in seconds
 */
export const getTokenExpiresIn = (tokenType: 'access' | 'refresh'): number => {
  const expiry = tokenType === 'access'
    ? config.jwt.accessTokenExpiry
    : config.jwt.refreshTokenExpiry;

  if (!expiry) {
    throw new Error('Token expiry configuration is missing');
  }

  // Parse duration string (e.g., "24h", "30d") to seconds
  const match = expiry.match(/^(\d+)([hdm])$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid token expiry format: ${expiry}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'h': // hours
      return value * 60 * 60;
    case 'd': // days
      return value * 24 * 60 * 60;
    case 'm': // minutes
      return value * 60;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
};
