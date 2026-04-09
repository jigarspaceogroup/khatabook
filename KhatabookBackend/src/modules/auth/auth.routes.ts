/**
 * Auth Routes
 * Defines authentication API endpoints
 */

import { Router } from 'express';
import * as authController from './auth.controller';
import {
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  logoutSchema,
  updateUserProfileSchema,
} from './auth.validators';
import { validate } from '../../middleware/validation.middleware';
import { authenticateToken } from '../../middleware/auth.middleware';
import { otpSendLimiter, otpVerifyLimiter } from '../../middleware/rateLimit.middleware';

const router: Router = Router();

/**
 * POST /auth/send-otp
 * Send OTP to phone number
 * @public
 */
router.post('/send-otp', otpSendLimiter, validate(sendOtpSchema), authController.sendOtp);

/**
 * POST /auth/verify-otp
 * Verify OTP and create session
 * @public
 */
router.post('/verify-otp', otpVerifyLimiter, validate(verifyOtpSchema), authController.verifyOtp);

/**
 * POST /auth/refresh-token
 * Refresh access token using refresh token
 * @public
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

/**
 * POST /auth/logout
 * Logout user and revoke session(s)
 * @protected - Requires authentication
 */
router.post('/logout', authenticateToken, validate(logoutSchema), authController.logout);

/**
 * GET /auth/me
 * Get authenticated user profile
 * @protected - Requires authentication
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * PUT /auth/me
 * Update authenticated user profile
 * @protected - Requires authentication
 */
router.put('/me', authenticateToken, validate(updateUserProfileSchema), authController.updateMe);

/**
 * GET /auth/sessions
 * List all active sessions for user
 * @protected - Requires authentication
 */
router.get('/sessions', authenticateToken, authController.getSessions);

/**
 * DELETE /auth/sessions/:id
 * Revoke specific session
 * @protected - Requires authentication
 */
router.delete('/sessions/:id', authenticateToken, authController.deleteSession);

export default router;
