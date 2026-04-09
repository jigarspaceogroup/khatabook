/**
 * Auth Controller
 * HTTP request handlers for authentication endpoints
 */

import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../constants/httpStatus';
import * as authService from './auth.service';
import logger from '../../utils/logger';

/**
 * POST /auth/send-otp
 * Send OTP to phone number
 */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number } = req.body;

    const result = await authService.sendOtp(phone_number);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Send OTP controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    // Send error response
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'OTP_SEND_FAILED',
        message: error instanceof Error ? error.message : 'Failed to send OTP',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * POST /auth/verify-otp
 * Verify OTP and create session
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, otp, device_id, device_type, device_name } = req.body;

    const result = await authService.verifyOtp(
      phone_number,
      otp,
      device_id,
      device_type,
      device_name
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Verify OTP controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
    const isInvalidOtp = errorMessage.includes('Invalid or expired OTP');

    res.status(isInvalidOtp ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: isInvalidOtp ? 'INVALID_OTP' : 'OTP_VERIFICATION_FAILED',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * POST /auth/refresh-token
 * Refresh access token using refresh token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token, device_id } = req.body;

    const result = await authService.refreshAccessToken(refresh_token, device_id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Refresh token controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';
    const isInvalidToken = errorMessage.includes('Invalid') || errorMessage.includes('expired');

    res.status(isInvalidToken ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: isInvalidToken ? 'INVALID_REFRESH_TOKEN' : 'TOKEN_REFRESH_FAILED',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * POST /auth/logout
 * Logout user and revoke session(s)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // Set by auth middleware
    const { device_id, logout_all_devices } = req.body;

    const result = await authService.logout(userId, device_id, logout_all_devices);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Logout controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: error instanceof Error ? error.message : 'Failed to logout',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * GET /auth/me
 * Get authenticated user profile
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // Set by auth middleware

    const result = await authService.getUserProfile(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Get me controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: error instanceof Error ? error.message : 'User not found',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * PUT /auth/me
 * Update authenticated user profile
 */
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // Set by auth middleware
    const updates = req.body;

    const result = await authService.updateUserProfile(userId, updates);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Update me controller error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'UPDATE_PROFILE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.requestId,
      },
    });
  }
};

/**
 * GET /auth/sessions  
 * List all active sessions for authenticated user
 */
export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sessions = await authService.getUserSessions(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: sessions,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Get sessions error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });
    throw new AppError('SESSION_LIST_FAILED', 'Failed to retrieve sessions', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * DELETE /auth/sessions/:id
 * Revoke specific session
 */
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sessionId = req.params.id;
    await authService.revokeSession(sessionId, userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { message: 'Session revoked successfully' },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.requestId,
      },
    });
  } catch (error) {
    logger.error('Delete session error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.requestId,
    });
    throw new AppError('SESSION_REVOKE_FAILED', 'Failed to revoke session', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
