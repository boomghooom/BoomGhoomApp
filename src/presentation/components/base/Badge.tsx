/**
 * Badge Component
 * Status indicators, labels, and counts
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from './Text';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'outlined';
type BadgeSize = 'small' | 'medium';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  icon,
  style,
}) => {
  const { colors, gradients, semantic } = useTheme();

  const sizeStyles = {
    small: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.xs,
      textVariant: 'tiny' as const,
    },
    medium: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      textVariant: 'badge' as const,
    },
  };

  const variantStyles: Record<
    BadgeVariant,
    { backgroundColor: string; textColor: string; borderColor?: string }
  > = {
    default: {
      backgroundColor: colors.surface,
      textColor: colors.textSecondary,
    },
    success: {
      backgroundColor: semantic.successLight,
      textColor: semantic.success,
    },
    warning: {
      backgroundColor: semantic.warningLight,
      textColor: semantic.warning,
    },
    error: {
      backgroundColor: semantic.errorLight,
      textColor: semantic.error,
    },
    info: {
      backgroundColor: semantic.infoLight,
      textColor: semantic.info,
    },
    gradient: {
      backgroundColor: 'transparent',
      textColor: themeColors.common.white,
    },
    outlined: {
      backgroundColor: 'transparent',
      textColor: themeColors.primary.purple,
      borderColor: themeColors.primary.purple,
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradients.primary as unknown as string[]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.container,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
          style,
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text variant={currentSize.textVariant} style={{ color: currentVariant.textColor }}>
          {label}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentVariant.backgroundColor,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          ...(currentVariant.borderColor && {
            borderWidth: 1,
            borderColor: currentVariant.borderColor,
          }),
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant={currentSize.textVariant} style={{ color: currentVariant.textColor }}>
        {label}
      </Text>
    </View>
  );
};

// Count Badge (for notifications, etc.)
interface CountBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'small',
  style,
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const minSize = size === 'small' ? 18 : 22;

  return (
    <View
      style={[
        styles.countBadge,
        {
          minWidth: minSize,
          height: minSize,
          borderRadius: minSize / 2,
          paddingHorizontal: count > 9 ? spacing.xs : 0,
        },
        style,
      ]}
    >
      <Text
        variant={size === 'small' ? 'tiny' : 'badge'}
        style={styles.countText}
      >
        {displayCount}
      </Text>
    </View>
  );
};

// Dot Badge (simple indicator)
interface DotBadgeProps {
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: number;
  pulse?: boolean;
  style?: ViewStyle;
}

export const DotBadge: React.FC<DotBadgeProps> = ({
  color = 'primary',
  size = 8,
  style,
}) => {
  const colors: Record<string, string> = {
    primary: themeColors.primary.purple,
    success: themeColors.semantic.success,
    warning: themeColors.semantic.warning,
    error: themeColors.semantic.error,
  };

  return (
    <View
      style={[
        styles.dotBadge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[color],
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xxs,
  },
  countBadge: {
    backgroundColor: themeColors.semantic.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: themeColors.common.white,
    fontWeight: '700',
  },
  dotBadge: {},
});

export default Badge;

