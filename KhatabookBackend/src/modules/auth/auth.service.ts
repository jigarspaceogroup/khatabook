/**
 * Auth Service
 * Business logic for authentication operations
 */

import bcrypt from 'bcrypt';
import { config } from '../../config';
import { prisma } from '../../database/client';
import { sendOTP as sendSupabaseOTP, verifyOTP as verifySupabaseOTP } from '../../services/supabase';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getTokenExpiresIn,
} from '../../utils/jwt';
import {
  SendOtpResponse,
  VerifyOtpResponse,
  RefreshTokenResponse,
  LogoutResponse,
  GetUserProfileResponse,
  UpdateUserProfileResponse,
} from './auth.types';
import logger from '../../utils/logger';

/**
 * Send OTP to phone number using Supabase Auth
 */
export const sendOtp = async (phoneNumber: string): Promise<SendOtpResponse> => {
  try {
    logger.info('Sending OTP', { phoneNumber });

    // In development, provide a test OTP message
    if (config.app.isDevelopment) {
      logger.warn('Development mode: OTP not sent via SMS. Use any 6-digit code for testing.', {
        phoneNumber,
      });

      return {
        message: 'Development mode: Use any 6-digit OTP (e.g., 123456) for testing',
        expires_in: 600, // 10 minutes for dev
      };
    }

    // Use Supabase service for OTP sending
    const result = await sendSupabaseOTP(phoneNumber);

    logger.info('OTP sent successfully', { phoneNumber });

    return {
      message: 'OTP sent successfully to your phone number',
      expires_in: 60, // Supabase OTP expires in 60 seconds
    };
  } catch (error) {
    logger.error('Send OTP error', {
      phoneNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Verify OTP and create session
 */
export const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  deviceId: string,
  deviceType: string,
  deviceName?: string
): Promise<VerifyOtpResponse> => {
  try {
    logger.info('Verifying OTP', { phoneNumber, deviceId });

    // Step 1: Verify OTP with Supabase (or skip in development)
    let skipOtpVerification = false;

    if (config.app.isDevelopment) {
      // In development, accept any 6-digit OTP
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        logger.warn('Development mode: Skipping Supabase OTP verification', {
          phoneNumber,
        });
        skipOtpVerification = true;
      }
    }

    if (!skipOtpVerification) {
      // Use Supabase service for OTP verification in production
      try {
        await verifySupabaseOTP(phoneNumber, otp);
      } catch (error) {
        logger.error('Supabase OTP verification failed', {
          phoneNumber,
          error: error instanceof Error ? error.message : String(error),
        });
        throw new Error('Invalid or expired OTP');
      }
    }

    // Step 2: Check if user exists in our database (using Prisma)
    let existingUser = await prisma.user.findFirst({
      where: {
        phone_number: phoneNumber,
        deleted_at: null,
      },
    });

    let user: any;
    let isNewUser = false;

    if (!existingUser) {
      // Step 3a: Create new user using Prisma
      logger.info('Creating new user', { phoneNumber });

      user = await prisma.user.create({
        data: {
          phone_number: phoneNumber,
          phone_verified: true,
          last_login_at: new Date(),
        },
      });

      isNewUser = true;
    } else {
      // Step 3b: Update existing user using Prisma
      logger.info('Updating existing user', { phoneNumber });

      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          phone_verified: true,
          last_login_at: new Date(),
        },
      });
    }

    // Step 4: Create session first (to get session ID) using Prisma
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    // Generate temporary tokens to get session ID
    const tempRefreshToken = generateRefreshToken(user.id, phoneNumber, 'temp');
    const refreshTokenHash = await bcrypt.hash(tempRefreshToken, 10);

    const session = await prisma.session.create({
      data: {
        user_id: user.id,
        device_id: deviceId,
        device_type: deviceType,
        device_name: deviceName || null,
        refresh_token_hash: refreshTokenHash,
        expires_at: expiresAt,
        last_activity_at: new Date(),
      },
    });

    // Step 5: Generate JWT tokens with deviceId and sessionId
    const accessToken = generateAccessToken(user.id, phoneNumber, deviceId);
    const refreshToken = generateRefreshToken(user.id, phoneNumber, session.id);

    // Step 6: Hash refresh token and update session
    const finalRefreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await prisma.session.update({
      where: { id: session.id },
      data: { refresh_token_hash: finalRefreshTokenHash },
    });

    logger.info('OTP verified successfully', {
      userId: user.id,
      isNewUser,
    });

    return {
      user: {
        id: user.id,
        phone_number: user.phone_number,
        name: user.name,
        email: user.email,
        language_code: user.language_code,
        profile_image_url: user.profile_image_url,
        phone_verified: user.phone_verified,
        created_at: user.created_at.toISOString(),
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: getTokenExpiresIn('access'),
      is_new_user: isNewUser,
    };
  } catch (error) {
    logger.error('Verify OTP error', {
      phoneNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (
  refreshToken: string,
  deviceId: string
): Promise<RefreshTokenResponse> => {
  try {
    logger.info('Refreshing access token', { deviceId });

    // Step 1: Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Step 2: Find active session using Prisma
    const session = await prisma.session.findFirst({
      where: {
        user_id: decoded.userId,
        device_id: deviceId,
        revoked_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!session) {
      logger.error('Session not found', { userId: decoded.userId, deviceId });
      throw new Error('Invalid session');
    }

    // Step 3: Verify refresh token hash
    const isValidToken = await bcrypt.compare(refreshToken, session.refresh_token_hash);

    if (!isValidToken) {
      logger.error('Invalid refresh token hash', { sessionId: session.id });
      throw new Error('Invalid refresh token');
    }

    // Step 4: Generate new tokens with deviceId and sessionId
    const newAccessToken = generateAccessToken(decoded.userId, decoded.phoneNumber, deviceId);
    const newRefreshToken = generateRefreshToken(decoded.userId, decoded.phoneNumber, session.id);

    // Step 5: Update session with new refresh token hash using Prisma
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refresh_token_hash: newRefreshTokenHash,
        last_activity_at: new Date(),
      },
    });

    logger.info('Token refreshed successfully', { userId: decoded.userId });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: getTokenExpiresIn('access'),
    };
  } catch (error) {
    logger.error('Refresh token error', {
      deviceId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Logout user and revoke session(s)
 */
export const logout = async (
  userId: string,
  deviceId?: string,
  logoutAllDevices?: boolean
): Promise<LogoutResponse> => {
  try {
    logger.info('Logging out user', { userId, deviceId, logoutAllDevices });

    // Build where clause for Prisma
    const whereClause: any = {
      user_id: userId,
      revoked_at: null,
    };

    if (!logoutAllDevices) {
      if (!deviceId) {
        throw new Error('Device ID required when not logging out from all devices');
      }
      whereClause.device_id = deviceId;
      logger.info('Logging out from specific device', { userId, deviceId });
    } else {
      logger.info('Logging out from all devices', { userId });
    }

    // Update sessions using Prisma
    const result = await prisma.session.updateMany({
      where: whereClause,
      data: {
        revoked_at: new Date(),
      },
    });

    logger.info('Logout successful', {
      userId,
      devicesLoggedOut: result.count,
    });

    return {
      message: logoutAllDevices
        ? 'Logged out from all devices successfully'
        : 'Logged out successfully',
      devices_logged_out: result.count,
    };
  } catch (error) {
    logger.error('Logout error', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<GetUserProfileResponse> => {
  try {
    logger.info('Fetching user profile', { userId });

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deleted_at: null,
      },
    });

    if (!user) {
      logger.error('User not found', { userId });
      throw new Error('User not found');
    }

    return {
      id: user.id,
      phone_number: user.phone_number,
      name: user.name,
      email: user.email,
      language_code: user.language_code,
      profile_image_url: user.profile_image_url,
      phone_verified: user.phone_verified,
      biometric_enabled: user.biometric_enabled,
      last_login_at: user.last_login_at?.toISOString() || null,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  } catch (error) {
    logger.error('Get user profile error', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string;
    email?: string;
    language_code?: string;
    profile_image_url?: string;
    biometric_enabled?: boolean;
  }
): Promise<UpdateUserProfileResponse> => {
  try {
    logger.info('Updating user profile', { userId, updates });

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updates,
        updated_at: new Date(),
      },
    });

    logger.info('User profile updated successfully', { userId });

    return {
      id: user.id,
      phone_number: user.phone_number,
      name: user.name,
      email: user.email,
      language_code: user.language_code,
      profile_image_url: user.profile_image_url,
      phone_verified: user.phone_verified,
      biometric_enabled: user.biometric_enabled,
      updated_at: user.updated_at.toISOString(),
    };
  } catch (error) {
    logger.error('Update user profile error', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Get all active sessions for user
 */
export const getUserSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      user_id: userId,
      expires_at: { gt: new Date() },
      revoked_at: null,
    },
    select: {
      id: true,
      device_id: true,
      device_type: true,
      device_name: true,
      ip_address: true,
      last_activity_at: true,
      created_at: true,
      expires_at: true,
    },
    orderBy: {
      last_activity_at: 'desc',
    },
  });

  return sessions;
};

/**
 * Revoke specific session (only if belongs to user)
 */
export const revokeSession = async (sessionId: string, userId: string) => {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      user_id: userId,
    },
  });

  if (!session) {
    throw new Error('Session not found or does not belong to user');
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: { revoked_at: new Date() },
  });
};
