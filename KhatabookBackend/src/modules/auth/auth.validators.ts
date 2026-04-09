/**
 * Auth Module Request Validators (Zod Schemas)
 */

import { z } from 'zod';

/**
 * Send OTP Validator
 */
export const sendOtpSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+91\d{10}$/, 'Phone number must be in format +91XXXXXXXXXX')
    .min(13)
    .max(13),
});

/**
 * Verify OTP Validator
 */
export const verifyOtpSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+91\d{10}$/, 'Phone number must be in format +91XXXXXXXXXX')
    .min(13)
    .max(13),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
  device_id: z
    .string()
    .min(1, 'Device ID is required')
    .max(255, 'Device ID too long'),
  device_type: z
    .string()
    .min(1, 'Device type is required')
    .max(50, 'Device type too long'),
  device_name: z
    .string()
    .max(255, 'Device name too long')
    .optional(),
});

/**
 * Refresh Token Validator
 */
export const refreshTokenSchema = z.object({
  refresh_token: z
    .string()
    .min(1, 'Refresh token is required'),
  device_id: z
    .string()
    .min(1, 'Device ID is required')
    .max(255, 'Device ID too long'),
});

/**
 * Logout Validator
 */
export const logoutSchema = z.object({
  device_id: z
    .string()
    .max(255, 'Device ID too long')
    .optional(),
  logout_all_devices: z
    .boolean()
    .optional()
    .default(false),
});

/**
 * Update User Profile Validator
 */
export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name too long')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .optional(),
  language_code: z
    .string()
    .length(2, 'Language code must be 2 characters (ISO 639-1)')
    .regex(/^[a-z]{2}$/, 'Language code must be lowercase letters')
    .optional(),
  profile_image_url: z
    .string()
    .url('Invalid image URL')
    .optional(),
  biometric_enabled: z
    .boolean()
    .optional(),
});
