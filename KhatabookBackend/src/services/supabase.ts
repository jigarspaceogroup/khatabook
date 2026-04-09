/**
 * Supabase Client
 * Provides Supabase Auth and Database client instances
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import logger from '../utils/logger';

/**
 * Validate Supabase configuration
 */
if (!config.supabase.url) {
  throw new Error('SUPABASE_URL is not configured');
}

if (!config.supabase.serviceKey) {
  throw new Error('SUPABASE_SERVICE_KEY is not configured');
}

/**
 * Supabase Client Instance
 * Uses service key for server-side operations including:
 * - Phone OTP authentication
 * - Database operations with RLS bypass
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

logger.info('Supabase client initialized', {
  url: config.supabase.url.substring(0, 50) + '...',
});

/**
 * Send OTP to phone number via Supabase Auth
 */
export const sendOTP = async (phoneNumber: string): Promise<{
  success: boolean;
  expiresAt: Date;
  retryAfter: number;
}> => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
    options: {
      channel: 'sms',
    },
  });

  if (error) {
    logger.error('Supabase OTP send failed', {
      error: error.message,
      phoneNumber,
    });
    throw new Error(error.message);
  }

  // OTP expires in 10 minutes by default in Supabase
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Retry after 60 seconds
  const retryAfter = 60;

  logger.info('OTP sent successfully', { phoneNumber });

  return {
    success: true,
    expiresAt,
    retryAfter,
  };
};

/**
 * Verify OTP via Supabase Auth
 */
export const verifyOTP = async (
  phoneNumber: string,
  otp: string
): Promise<{
  userId: string;
  phoneNumber: string;
  isNewUser: boolean;
}> => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: 'sms',
  });

  if (error) {
    logger.error('Supabase OTP verification failed', {
      error: error.message,
      phoneNumber,
    });
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('User not found after OTP verification');
  }

  // Check if user is new (created_at is very recent)
  const createdAt = new Date(data.user.created_at || Date.now());
  const now = new Date();
  const isNewUser = (now.getTime() - createdAt.getTime()) < 60000; // Within 1 minute

  logger.info('OTP verified successfully', {
    userId: data.user.id,
    phoneNumber,
    isNewUser,
  });

  return {
    userId: data.user.id,
    phoneNumber: data.user.phone || phoneNumber,
    isNewUser,
  };
};
