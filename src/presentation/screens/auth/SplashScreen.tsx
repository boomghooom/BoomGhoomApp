/**
 * Splash Screen
 * Animated logo splash with gradient background
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { Logo } from '@components/shared';
import { Text } from '@components/base';
import { useTheme, colors as themeColors } from '@theme/index';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { gradients } = useTheme();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 600, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
    );

    // Animate tagline
    taglineOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) })
    );
    taglineTranslateY.value = withDelay(
      500,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
    );

    // Finish splash after animations
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={['#0A0A0F', '#12121A', '#0A0A0F']}
      style={styles.container}
    >
      {/* Background glow effects */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(155, 109, 255, 0.15)', 'transparent']}
          style={styles.glowPurple}
        />
        <LinearGradient
          colors={['rgba(255, 138, 80, 0.1)', 'transparent']}
          style={styles.glowOrange}
        />
      </View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Logo size="xlarge" showText animated />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineAnimatedStyle]}>
        <Text variant="bodyLarge" color="secondary" align="center">
          Discover. Connect. Experience.
        </Text>
      </Animated.View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text variant="caption" color="muted">
          v1.0.0
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowPurple: {
    position: 'absolute',
    top: height * 0.2,
    left: -width * 0.3,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.6,
  },
  glowOrange: {
    position: 'absolute',
    bottom: height * 0.2,
    right: -width * 0.3,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.6,
  },
  logoContainer: {
    alignItems: 'center',
  },
  taglineContainer: {
    marginTop: 24,
    paddingHorizontal: 40,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
  },
});

export default SplashScreen;

