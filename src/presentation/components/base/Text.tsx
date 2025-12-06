/**
 * Text Component
 * Typography wrapper with theme support
 */

import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { typography, TypographyVariant, useTheme } from '@theme/index';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'accent' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { colors, primary } = useTheme();

  const textColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return colors.text;
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'muted':
        return colors.textMuted;
      case 'accent':
        return primary.purple;
      case 'error':
        return '#F87171';
      case 'success':
        return '#34D399';
      case 'warning':
        return '#FBBF24';
      default:
        return colors.text;
    }
  }, [color, colors, primary]);

  const combinedStyle: TextStyle = useMemo(
    () => ({
      ...typography[variant],
      color: textColor,
      textAlign: align,
    }),
    [variant, textColor, align]
  );

  return (
    <RNText style={[combinedStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

// Preset components for common use cases
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" color="secondary" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" color="secondary" {...props} />
);

export default Text;

