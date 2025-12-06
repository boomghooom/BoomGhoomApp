/**
 * IconButton Component
 * Touch-optimized icon button with haptic feedback
 */

import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { CountBadge } from './Badge';
import { useTheme, spacing, borderRadius, minTouchTarget, colors as themeColors } from '@theme/index';

type IconButtonVariant = 'default' | 'filled' | 'tinted' | 'blur' | 'ghost';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: string;
  disabled?: boolean;
  badge?: number;
  style?: ViewStyle;
  haptic?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SIZES: Record<IconButtonSize, { container: number; icon: number }> = {
  small: { container: 36, icon: 18 },
  medium: { container: minTouchTarget, icon: 22 },
  large: { container: 56, icon: 26 },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'medium',
  color,
  disabled = false,
  badge,
  style,
  haptic = true,
}) => {
  const { colors, theme, primary } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [haptic, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeConfig = SIZES[size];

  const variantStyles: Record<IconButtonVariant, { background: string; iconColor: string }> = {
    default: {
      background: colors.surface,
      iconColor: color || colors.text,
    },
    filled: {
      background: primary.purple,
      iconColor: themeColors.common.white,
    },
    tinted: {
      background: 'rgba(155, 109, 255, 0.15)',
      iconColor: primary.purple,
    },
    blur: {
      background: 'transparent',
      iconColor: color || colors.text,
    },
    ghost: {
      background: 'transparent',
      iconColor: color || colors.textSecondary,
    },
  };

  const currentVariant = variantStyles[variant];

  const containerStyle: ViewStyle = {
    width: sizeConfig.container,
    height: sizeConfig.container,
    borderRadius: sizeConfig.container / 2,
    backgroundColor: currentVariant.background,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const renderContent = () => (
    <>
      <Ionicons
        name={icon}
        size={sizeConfig.icon}
        color={disabled ? colors.disabledText : currentVariant.iconColor}
      />
      {badge !== undefined && badge > 0 && (
        <View style={styles.badgeContainer}>
          <CountBadge count={badge} size="small" />
        </View>
      )}
    </>
  );

  if (variant === 'blur') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[animatedStyle]}
      >
        <BlurView
          intensity={theme === 'dark' ? 40 : 80}
          tint={theme}
          style={[styles.container, containerStyle, { overflow: 'hidden' }]}
        >
          {renderContent()}
        </BlurView>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.container, containerStyle, animatedStyle]}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});

export default IconButton;

