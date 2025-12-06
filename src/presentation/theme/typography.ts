/**
 * BoomGhoom Typography System
 * Modern, legible sans-serif with clear visual hierarchy
 */

import { TextStyle } from 'react-native';

// Font families - using system fonts with fallbacks
// In production, you can load custom fonts like 'Outfit', 'Satoshi', or 'Plus Jakarta Sans'
export const fontFamily = {
  // Primary: Clean, modern geometric sans-serif
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',

  // Mono for numbers/codes
  mono: 'System',
} as const;

// Font weights mapping
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Font sizes following a modular scale (1.25 ratio)
export const fontSize = {
  // Display (hero text)
  display1: 48,
  display2: 40,
  display3: 32,

  // Headings
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,

  // Body
  bodyLarge: 17,
  body: 15,
  bodySmall: 13,

  // Supporting
  caption: 12,
  tiny: 10,
  micro: 8,

  // Special
  button: 15,
  buttonSmall: 13,
  input: 16,
  label: 12,
  badge: 11,
  tab: 11,
} as const;

// Line heights
export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.75,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

// Typography presets
export const typography: Record<string, TextStyle> = {
  // Display styles
  display1: {
    fontSize: fontSize.display1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.display1 * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  display2: {
    fontSize: fontSize.display2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.display2 * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  display3: {
    fontSize: fontSize.display3,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.display3 * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },

  // Headings
  h1: {
    fontSize: fontSize.h1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.h1 * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize.h2,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.h2 * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize.h3,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.h3 * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSize.h4,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.h4 * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body styles
  bodyLarge: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.bodyLarge * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyLargeMedium: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.bodyLarge * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.body * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontSize: fontSize.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.body * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmallMedium: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Supporting styles
  caption: {
    fontSize: fontSize.caption,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.caption * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  captionMedium: {
    fontSize: fontSize.caption,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.caption * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  tiny: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.tiny * lineHeight.normal,
    letterSpacing: letterSpacing.wider,
  },

  // Interactive elements
  button: {
    fontSize: fontSize.button,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.button * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: fontSize.buttonSmall,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.buttonSmall * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  input: {
    fontSize: fontSize.input,
    fontWeight: fontWeights.regular,
    lineHeight: fontSize.input * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.label * lineHeight.tight,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  badge: {
    fontSize: fontSize.badge,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.badge * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  tab: {
    fontSize: fontSize.tab,
    fontWeight: fontWeights.medium,
    lineHeight: fontSize.tab * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },

  // Numbers (for prices, stats)
  number: {
    fontSize: fontSize.h2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSize.h2 * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontVariant: ['tabular-nums'],
  },
  numberSmall: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSize.bodyLarge * lineHeight.tight,
    letterSpacing: letterSpacing.normal,
    fontVariant: ['tabular-nums'],
  },
};

export type TypographyVariant = keyof typeof typography;

