/**
 * BoomGhoom Theme - Central Export
 * Import this file to access the complete design system
 */

export { colors, getThemeColors } from './colors';
export type { ColorTheme, ThemeColors } from './colors';

export { typography, fontSize, fontWeights, letterSpacing, lineHeight, fontFamily } from './typography';
export type { TypographyVariant } from './typography';

export {
  spacing,
  screenPadding,
  componentSpacing,
  borderRadius,
  shadows,
  duration,
  easing,
  zIndex,
  hitSlop,
  minTouchTarget,
} from './spacing';
export type { Spacing, BorderRadius } from './spacing';

export { ThemeProvider, ThemeContext, useTheme } from './ThemeProvider';
export type { ThemeContextType } from './ThemeProvider';
