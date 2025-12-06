/**
 * KYC Success Screen
 * Verification completion confirmation
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

import { Text, Button } from '@components/base';
import { useTheme, spacing, colors as themeColors } from '@theme/index';

const { width } = Dimensions.get('window');

interface KYCSuccessScreenProps {
  onContinue: () => void;
}

export const KYCSuccessScreen: React.FC<KYCSuccessScreenProps> = ({ onContinue }) => {
  const { colors, primary } = useTheme();
  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate check mark
    checkScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      )
    );

    // Animate content
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    contentTranslateY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Background particles */}
      <View style={styles.particlesContainer}>
        {/* Add particle/confetti effect here */}
      </View>

      <View style={styles.content}>
        {/* Success icon */}
        <Animated.View style={[styles.iconContainer, checkAnimatedStyle]}>
          <LinearGradient
            colors={[themeColors.semantic.success, '#22C55E']}
            style={styles.iconGradient}
          >
            <Ionicons name="checkmark" size={64} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentAnimatedStyle]}>
          <Text variant="display3" align="center" style={styles.title}>
            You're Verified!
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
            Your KYC verification is complete. You can now create events and start earning.
          </Text>

          {/* Benefits unlocked */}
          <View style={styles.benefitsContainer}>
            <Text variant="label" color="secondary" style={styles.benefitsTitle}>
              UNLOCKED FEATURES
            </Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                  <Ionicons name="add-circle-outline" size={20} color={themeColors.semantic.success} />
                </View>
                <Text variant="bodyMedium">Create Events</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: 'rgba(155, 109, 255, 0.15)' }]}>
                  <Ionicons name="cash-outline" size={20} color={primary.purple} />
                </View>
                <Text variant="bodyMedium">Earn Commissions</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: 'rgba(255, 138, 80, 0.15)' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.primary.orange} />
                </View>
                <Text variant="bodyMedium">Verified Badge</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, contentAnimatedStyle]}>
        <Button
          label="Start Exploring"
          onPress={onContinue}
          fullWidth
          icon="arrow-forward"
          iconPosition="right"
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing['2xl'],
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: themeColors.semantic.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  benefitsContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  benefitsTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  benefitsList: {
    gap: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
  },
});

export default KYCSuccessScreen;

