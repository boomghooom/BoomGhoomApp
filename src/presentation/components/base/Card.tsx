/**
 * Card Component
 * Premium card with multiple styles and press states
 */

import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme, spacing, borderRadius, shadows } from '@theme/index';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  haptic?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  disabled = false,
  style,
  padding = 'medium',
  haptic = true,
}) => {
  const { colors, gradients, theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }, [onPress, scale]);

  const handlePress = useCallback(() => {
    if (onPress) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  }, [haptic, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const paddingValue = {
    none: 0,
    small: spacing.sm,
    medium: spacing.md,
    large: spacing.xl,
  }[padding];

  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
    },
    elevated: {
      backgroundColor: colors.cardElevated,
      borderRadius: borderRadius.lg,
      ...(theme === 'light' ? shadows.lg : {}),
    },
    outlined: {
      backgroundColor: 'transparent',
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    gradient: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const cardStyle: ViewStyle = {
    ...variantStyles[variant],
    padding: paddingValue,
    ...style,
  };

  const renderContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={gradients.cardGradient as unknown as string[]}
          style={[styles.gradientContainer, { padding: paddingValue }]}
        >
          {children}
        </LinearGradient>
      );
    }
    return children;
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[cardStyle, animatedStyle]}
      >
        {renderContent()}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedView style={[cardStyle, animatedStyle]}>
      {renderContent()}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
});

export default Card;

