/**
 * Typography system for Khatabook Clone
 * Based on CLAUDE.md design system specifications
 */

export const typography = {
  fontFamily: 'Roboto',

  display: {
    size: 28,
    weight: 'bold' as const,
  },
  h1: {
    size: 24,
    weight: 'bold' as const,
  },
  h2: {
    size: 20,
    weight: '600' as const,
  },
  h3: {
    size: 16,
    weight: '600' as const,
  },
  body: {
    size: 14,
    weight: 'normal' as const,
  },
  bodySmall: {
    size: 12,
    weight: 'normal' as const,
  },
  caption: {
    size: 11,
    weight: 'normal' as const,
  },
  button: {
    size: 16,
    weight: '600' as const,
  },
} as const;

export type TypographyKey = keyof typeof typography;
