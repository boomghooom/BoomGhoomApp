/**
 * KYC Intro Screen
 * Introduction to KYC verification process
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Text, Button, IconButton, Card } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

const { width } = Dimensions.get('window');

interface KYCStep {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const steps: KYCStep[] = [
  {
    icon: 'camera-outline',
    title: 'Take a Selfie',
    description: 'Quick photo to verify your identity',
  },
  {
    icon: 'card-outline',
    title: 'Upload ID (Optional)',
    description: 'Aadhaar, PAN, or Driving License',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Get Verified',
    description: 'Usually takes less than 5 minutes',
  },
];

interface KYCIntroScreenProps {
  onStart: () => void;
  onSkip?: () => void;
  onBack: () => void;
}

export const KYCIntroScreen: React.FC<KYCIntroScreenProps> = ({
  onStart,
  onSkip,
  onBack,
}) => {
  const { colors, primary, gradients } = useTheme();

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        {onSkip && (
          <Button label="Skip" variant="ghost" onPress={onSkip} size="small" />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.iconContainer}>
          <LinearGradient
            colors={[themeColors.primary.purple, themeColors.primary.blue]}
            style={styles.iconGradient}
          >
            <Ionicons name="finger-print" size={56} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text variant="h1" align="center" style={styles.title}>
            Verify Your Identity
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
            Complete KYC to create events and build trust with other users
          </Text>
        </Animated.View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <Card variant="default" style={styles.stepCard}>
                <View style={styles.stepContent}>
                  <View
                    style={[
                      styles.stepIconContainer,
                      { backgroundColor: 'rgba(155, 109, 255, 0.1)' },
                    ]}
                  >
                    <Ionicons name={step.icon} size={24} color={primary.purple} />
                  </View>
                  <View style={styles.stepText}>
                    <Text variant="bodyMedium">{step.title}</Text>
                    <Text variant="bodySmall" color="secondary">
                      {step.description}
                    </Text>
                  </View>
                  <View style={styles.stepNumber}>
                    <Text variant="caption" color="tertiary">
                      {index + 1}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        {/* Benefits */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={themeColors.semantic.success} />
            <Text variant="bodySmall" color="secondary" style={styles.benefitText}>
              Create and host events
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={themeColors.semantic.success} />
            <Text variant="bodySmall" color="secondary" style={styles.benefitText}>
              Earn commissions
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={themeColors.semantic.success} />
            <Text variant="bodySmall" color="secondary" style={styles.benefitText}>
              Build trust with verified badge
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label="Start Verification"
          onPress={onStart}
          fullWidth
          icon="arrow-forward"
          iconPosition="right"
        />
        <Text variant="caption" color="tertiary" align="center" style={styles.privacyNote}>
          Your data is encrypted and securely stored
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  stepsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepCard: {
    padding: spacing.md,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepText: {
    flex: 1,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsContainer: {
    gap: spacing.xs,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  privacyNote: {
    marginTop: spacing.md,
  },
});

export default KYCIntroScreen;

