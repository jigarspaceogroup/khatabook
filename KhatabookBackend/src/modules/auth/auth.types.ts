/**
 * Auth Module Type Definitions
 */

/**
 * Send OTP Request
 */
export interface SendOtpRequest {
  phone_number: string;
}

/**
 * Send OTP Response
 */
export interface SendOtpResponse {
  message: string;
  expires_in: number; // seconds until OTP expires
}

/**
 * Verify OTP Request
 */
export interface VerifyOtpRequest {
  phone_number: string;
  otp: string;
  device_id: string;
  device_type: string;
  device_name?: string;
}

/**
 * Verify OTP Response
 */
export interface VerifyOtpResponse {
  user: {
    id: string;
    phone_number: string;
    name: string | null;
    email: string | null;
    language_code: string;
    profile_image_url: string | null;
    phone_verified: boolean;
    created_at: string;
  };
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds until access token expires
  is_new_user: boolean;
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
  refresh_token: string;
  device_id: string;
}

/**
 * Refresh Token Response
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Logout Request
 */
export interface LogoutRequest {
  device_id?: string; // If not provided, logout from current device only
  logout_all_devices?: boolean; // If true, logout from all devices
}

/**
 * Logout Response
 */
export interface LogoutResponse {
  message: string;
  devices_logged_out: number;
}

/**
 * Get User Profile Response
 */
export interface GetUserProfileResponse {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  language_code: string;
  profile_image_url: string | null;
  phone_verified: boolean;
  biometric_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Update User Profile Request
 */
export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  language_code?: string;
  profile_image_url?: string;
  biometric_enabled?: boolean;
}

/**
 * Update User Profile Response
 */
export interface UpdateUserProfileResponse {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  language_code: string;
  profile_image_url: string | null;
  phone_verified: boolean;
  biometric_enabled: boolean;
  updated_at: string;
}
