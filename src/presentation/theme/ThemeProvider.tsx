/**
 * BoomGhoom Theme Provider
 * Manages theme state and provides theme context to the app
 */

import React, { useState, useCallback, useMemo, ReactNode, useEffect, createContext, useContext } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ColorTheme, getThemeColors, ThemeColors, colors } from './colors';

// Theme Context Type
export interface ThemeContextType {
  theme: ColorTheme;
  colors: ThemeColors;
  gradients: typeof colors.gradients;
  semantic: typeof colors.semantic;
  primary: typeof colors.primary;
  toggleTheme: () => void;
  setTheme: (theme: ColorTheme) => void;
}

// Theme Context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: getThemeColors('dark'),
  gradients: colors.gradients,
  semantic: colors.semantic,
  primary: colors.primary,
  toggleTheme: () => {},
  setTheme: () => {},
});

// useTheme hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ColorTheme;
  followSystem?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'dark',
  followSystem = false,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ColorTheme>(
    followSystem && systemColorScheme ? systemColorScheme : initialTheme
  );

  // Follow system theme changes if enabled
  useEffect(() => {
    if (followSystem && systemColorScheme) {
      setThemeState(systemColorScheme);
    }
  }, [followSystem, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: ColorTheme) => {
    setThemeState(newTheme);
  }, []);

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      colors: getThemeColors(theme),
      gradients: colors.gradients,
      semantic: colors.semantic,
      primary: colors.primary,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? colors.dark.background : colors.light.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
