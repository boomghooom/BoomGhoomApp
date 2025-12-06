/**
 * BoomGhoom Spacing System
 * Consistent spacing scale for layouts and components
 * Based on 4px grid system
 */

// Base spacing unit
const BASE = 4;

export const spacing = {
  // Micro spacing
  none: 0,
  xxs: BASE, // 4px
  xs: BASE * 2, // 8px
  sm: BASE * 3, // 12px
  md: BASE * 4, // 16px
  lg: BASE * 5, // 20px
  xl: BASE * 6, // 24px
  '2xl': BASE * 8, // 32px
  '3xl': BASE * 10, // 40px
  '4xl': BASE * 12, // 48px
  '5xl': BASE * 16, // 64px
  '6xl': BASE * 20, // 80px
  '7xl': BASE * 24, // 96px
} as const;

// Screen padding
export const screenPadding = {
  horizontal: spacing.lg, // 20px
  vertical: spacing.md, // 16px
  safeBottom: spacing['2xl'], // 32px for tab bar area
} as const;

// Component spacing
export const componentSpacing = {
  // Card padding
  cardPadding: spacing.md,
  cardPaddingLarge: spacing.xl,

  // Button padding
  buttonPaddingHorizontal: spacing.xl,
  buttonPaddingVertical: spacing.sm,
  buttonPaddingHorizontalSmall: spacing.md,
  buttonPaddingVerticalSmall: spacing.xs,

  // Input padding
  inputPaddingHorizontal: spacing.md,
  inputPaddingVertical: spacing.sm,

  // List item spacing
  listItemSpacing: spacing.sm,
  listItemPadding: spacing.md,

  // Section spacing
  sectionSpacing: spacing['2xl'],
  sectionSpacingLarge: spacing['3xl'],

  // Icon spacing
  iconSpacing: spacing.sm,
  iconSpacingSmall: spacing.xs,

  // Avatar sizes
  avatarSizeSmall: spacing['2xl'], // 32px
  avatarSizeMedium: spacing['3xl'], // 40px
  avatarSizeLarge: spacing['4xl'], // 48px
  avatarSizeXLarge: spacing['5xl'], // 64px
  avatarSizeHuge: spacing['6xl'], // 80px
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Shadows (for light mode primarily)
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  // Glow shadows for accent elements
  glow: {
    shadowColor: '#9B6DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glowOrange: {
    shadowColor: '#FF8A50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Animation durations
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 750,
} as const;

// Animation easing
export const easing = {
  // Standard Material Design easings
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
  // Spring-like
  spring: [0.175, 0.885, 0.32, 1.275] as const,
} as const;

// Z-index layers
export const zIndex = {
  base: 0,
  card: 1,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  toast: 600,
  tooltip: 700,
} as const;

// Hit slop for touch targets
export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;

// Minimum touch target size (accessibility)
export const minTouchTarget = 48;

export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;

