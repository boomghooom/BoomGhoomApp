/**
 * Logo Component
 * BoomGhoom brand logo with animated gradient
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Text } from '../base';
import { useTheme, spacing, colors as themeColors } from '@theme/index';

type LogoSize = 'small' | 'medium' | 'large' | 'xlarge';

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<LogoSize, { icon: number; text: 'h4' | 'h3' | 'h2' | 'h1' }> = {
  small: { icon: 32, text: 'h4' },
  medium: { icon: 48, text: 'h3' },
  large: { icon: 64, text: 'h2' },
  xlarge: { icon: 96, text: 'h1' },
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  animated = false,
  style,
}) => {
  const { colors, primary } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const sizeConfig = SIZES[size];

  React.useEffect(() => {
    if (animated) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1,
        false
      );
      scale.value = withRepeat(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [animated, rotation, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    if (!animated) return {};
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <AnimatedView style={[styles.iconContainer, animatedIconStyle]}>
        <Svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 100 100"
        >
          <Defs>
            <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={themeColors.primary.orange} />
              <Stop offset="33%" stopColor={themeColors.primary.magenta} />
              <Stop offset="66%" stopColor={themeColors.primary.purple} />
              <Stop offset="100%" stopColor={themeColors.primary.blue} />
            </LinearGradient>
          </Defs>
          <G>
            {/* Center circle */}
            <Circle cx="50" cy="35" r="15" fill="url(#logoGradient)" />
            {/* Bowl/orbit shape */}
            <Path
              d="M15 50 Q15 80 50 80 Q85 80 85 50"
              stroke="url(#logoGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left curl */}
            <Path
              d="M15 50 Q5 35 25 25"
              stroke="url(#logoGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right curl */}
            <Path
              d="M85 50 Q95 35 75 25"
              stroke="url(#logoGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
      </AnimatedView>
      {showText && (
        <Text variant={sizeConfig.text} style={styles.text}>
          Boom<Text variant={sizeConfig.text} color="accent">Ghoom</Text>
        </Text>
      )}
    </View>
  );
};

// Small icon-only version for use in headers
export const LogoIcon: React.FC<{ size?: number; style?: ViewStyle }> = ({
  size = 32,
  style,
}) => {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="logoIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.primary.orange} />
            <Stop offset="33%" stopColor={themeColors.primary.magenta} />
            <Stop offset="66%" stopColor={themeColors.primary.purple} />
            <Stop offset="100%" stopColor={themeColors.primary.blue} />
          </LinearGradient>
        </Defs>
        <G>
          <Circle cx="50" cy="35" r="15" fill="url(#logoIconGradient)" />
          <Path
            d="M15 50 Q15 80 50 80 Q85 80 85 50"
            stroke="url(#logoIconGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M15 50 Q5 35 25 25"
            stroke="url(#logoIconGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M85 50 Q95 35 75 25"
            stroke="url(#logoIconGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

export default Logo;

