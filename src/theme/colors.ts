/**
 * Color palette for Khatabook Clone
 * Based on CLAUDE.md design system specifications
 */

export const colors = {
  // Primary colors
  primaryRed: '#E53935',
  primaryGreen: '#1FAF38',
  primaryBlue: '#2C60E4',
  whatsappGreen: '#25D366',

  // Neutral colors
  background: '#F5F5F5',
  cardBg: '#FFFFFF',
  divider: '#EEEEEE',
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',

  // Semantic colors
  success: '#1FAF38',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2C60E4',

  // Additional UI colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
