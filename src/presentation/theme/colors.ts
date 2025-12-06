/**
 * BoomGhoom Color System
 * Inspired by the gradient logo (Orange -> Magenta -> Purple -> Blue)
 * Premium, modern, minimalistic dark-mode first design
 */

export const colors = {
  // Primary Brand Gradient Colors (from logo)
  primary: {
    orange: '#FF8A50',
    magenta: '#E066A0',
    purple: '#9B6DFF',
    blue: '#5B8DEF',
  },

  // Gradient definitions
  gradients: {
    primary: ['#FF8A50', '#E066A0', '#9B6DFF', '#5B8DEF'],
    primaryReverse: ['#5B8DEF', '#9B6DFF', '#E066A0', '#FF8A50'],
    warm: ['#FF8A50', '#E066A0'],
    cool: ['#9B6DFF', '#5B8DEF'],
    sunset: ['#FF8A50', '#E066A0', '#9B6DFF'],
    // Subtle gradients for backgrounds
    darkBackground: ['#0A0A0F', '#12121A', '#0A0A0F'],
    cardGradient: ['#1A1A24', '#14141C'],
    glowOrange: ['rgba(255, 138, 80, 0.4)', 'rgba(255, 138, 80, 0)'],
    glowPurple: ['rgba(155, 109, 255, 0.4)', 'rgba(155, 109, 255, 0)'],
  },

  // Dark Theme (Primary)
  dark: {
    // Backgrounds
    background: '#0A0A0F',
    backgroundElevated: '#12121A',
    surface: '#1A1A24',
    surfaceElevated: '#22222E',
    card: '#16161E',
    cardElevated: '#1E1E28',

    // Text
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textTertiary: '#6B6B7B',
    textMuted: '#4A4A58',

    // Borders
    border: '#2A2A36',
    borderLight: '#1F1F29',
    borderFocus: '#9B6DFF',

    // Interactive states
    pressed: 'rgba(155, 109, 255, 0.1)',
    hover: 'rgba(155, 109, 255, 0.05)',
    disabled: '#2A2A36',
    disabledText: '#4A4A58',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',
    shimmer: '#22222E',
  },

  // Light Theme (Secondary)
  light: {
    // Backgrounds
    background: '#FAFAFA',
    backgroundElevated: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F5F5F8',
    card: '#FFFFFF',
    cardElevated: '#F8F8FC',

    // Text
    text: '#1A1A24',
    textSecondary: '#5A5A6B',
    textTertiary: '#8A8A9B',
    textMuted: '#B0B0C0',

    // Borders
    border: '#E8E8F0',
    borderLight: '#F0F0F8',
    borderFocus: '#9B6DFF',

    // Interactive states
    pressed: 'rgba(155, 109, 255, 0.15)',
    hover: 'rgba(155, 109, 255, 0.08)',
    disabled: '#E8E8F0',
    disabledText: '#B0B0C0',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    shimmer: '#F0F0F8',
  },

  // Semantic Colors
  semantic: {
    success: '#34D399',
    successLight: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    error: '#F87171',
    errorLight: 'rgba(248, 113, 113, 0.15)',
    info: '#60A5FA',
    infoLight: 'rgba(96, 165, 250, 0.15)',
  },

  // Event type colors
  events: {
    sponsored: '#FFD700',
    userCreated: '#9B6DFF',
    free: '#34D399',
    paid: '#FF8A50',
  },

  // Gender colors (for ratio display)
  gender: {
    male: '#5B8DEF',
    female: '#E066A0',
    other: '#9B6DFF',
  },

  // Status colors
  status: {
    online: '#34D399',
    offline: '#6B6B7B',
    busy: '#F87171',
    away: '#FBBF24',
  },

  // Commission/Due colors
  finance: {
    due: '#F87171',
    commission: '#34D399',
    pending: '#FBBF24',
    available: '#34D399',
  },

  // Common colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

export type ColorTheme = 'dark' | 'light';
export type ThemeColors = typeof colors.dark | typeof colors.light;

export const getThemeColors = (theme: ColorTheme): ThemeColors => {
  return theme === 'dark' ? colors.dark : colors.light;
};

