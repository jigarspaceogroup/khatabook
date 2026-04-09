/**
 * API Constants
 * Centralized API configuration
 */

import { API_URL } from '@env';

// Use environment variable for API base URL
export const API_BASE_URL = API_URL;

// Debug: Log API URL on load
console.log('[API Config] API_BASE_URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    SESSIONS: `${API_BASE_URL}/auth/sessions`,
  },
};
