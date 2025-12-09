/**
 * BoomGhoom Theme Exports
 * Central export point for theme-related modules
 */

export { ThemeProvider, useTheme, ThemeContext } from './ThemeProvider';
export type { ThemeContextType } from './ThemeProvider';

export { colors, getThemeColors } from './colors';
export type { ColorTheme, ThemeColors } from './colors';

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

export {
  fontFamily,
  fontWeights,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
} from './typography';
export type { TypographyVariant } from './typography';

