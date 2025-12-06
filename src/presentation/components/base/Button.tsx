/**
 * Button Component
 * Premium, modern button with multiple variants and states
 */

import React, { useMemo, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text } from './Text';
import { useTheme, spacing, borderRadius, duration, colors as themeColors } from '@theme/index';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  haptic?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  haptic = true,
}) => {
  const { colors, gradients, theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.9, { duration: duration.fast });
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(1, { duration: duration.fast });
  }, [scale, opacity]);

  const handlePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [haptic, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const sizeStyles = useMemo(() => {
    const sizes: Record<ButtonSize, { height: number; paddingHorizontal: number; iconSize: number }> = {
      small: { height: 36, paddingHorizontal: spacing.md, iconSize: 16 },
      medium: { height: 48, paddingHorizontal: spacing.xl, iconSize: 20 },
      large: { height: 56, paddingHorizontal: spacing['2xl'], iconSize: 24 },
    };
    return sizes[size];
  }, [size]);

  const variantStyles = useMemo(() => {
    const isDisabled = disabled || loading;

    const styles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; useGradient: boolean }> = {
      primary: {
        container: {
          backgroundColor: isDisabled ? colors.disabled : 'transparent',
        },
        text: {
          color: isDisabled ? colors.disabledText : themeColors.common.white,
        },
        useGradient: !isDisabled,
      },
      secondary: {
        container: {
          backgroundColor: isDisabled ? colors.disabled : colors.surface,
        },
        text: {
          color: isDisabled ? colors.disabledText : colors.text,
        },
        useGradient: false,
      },
      outline: {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDisabled ? colors.disabled : themeColors.primary.purple,
        },
        text: {
          color: isDisabled ? colors.disabledText : themeColors.primary.purple,
        },
        useGradient: false,
      },
      ghost: {
        container: {
          backgroundColor: 'transparent',
        },
        text: {
          color: isDisabled ? colors.disabledText : themeColors.primary.purple,
        },
        useGradient: false,
      },
      danger: {
        container: {
          backgroundColor: isDisabled ? colors.disabled : themeColors.semantic.error,
        },
        text: {
          color: isDisabled ? colors.disabledText : themeColors.common.white,
        },
        useGradient: false,
      },
    };
    return styles[variant];
  }, [variant, disabled, loading, colors]);

  const textVariant = size === 'small' ? 'buttonSmall' : 'button';

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
          style={styles.loader}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconLeft}
            />
          )}
          <Text variant={textVariant} style={variantStyles.text}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...variantStyles.container,
    height: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    ...(fullWidth && styles.fullWidth),
    ...style,
  };

  if (variantStyles.useGradient) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[animatedStyle, fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={gradients.primary as unknown as string[]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradient, { height: sizeStyles.height, paddingHorizontal: sizeStyles.paddingHorizontal }]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[containerStyle, animatedStyle]}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  gradient: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  loader: {
    marginRight: spacing.xs,
  },
});

export default Button;

