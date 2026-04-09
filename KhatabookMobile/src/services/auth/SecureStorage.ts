/**
 * Secure Storage Service
 * Manages secure storage of auth tokens using react-native-keychain
 */

import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'com.khatabook.app';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Save auth tokens securely
 */
export const saveTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await Keychain.setGenericPassword(
      'auth_tokens',
      JSON.stringify(tokens),
      {
        service: SERVICE_NAME,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      }
    );
  } catch (error) {
    console.error('Failed to save tokens:', error);
    throw error;
  }
};

/**
 * Get stored auth tokens
 */
export const getTokens = async (): Promise<AuthTokens | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });

    if (credentials && credentials.password) {
      return JSON.parse(credentials.password);
    }

    return null;
  } catch (error) {
    console.error('Failed to get tokens:', error);
    return null;
  }
};

/**
 * Clear stored tokens (on logout)
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: SERVICE_NAME,
    });
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * Check if tokens exist
 */
export const hasTokens = async (): Promise<boolean> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });
    return !!credentials;
  } catch (error) {
    return false;
  }
};
