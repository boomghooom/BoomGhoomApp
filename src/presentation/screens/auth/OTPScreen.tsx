/**
 * OTP Verification Screen
 * Premium OTP input with auto-focus and resend timer
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Button, IconButton } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;

interface OTPScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({
  phoneNumber,
  onVerify,
  onResend,
  onBack,
}) => {
  const { colors, primary } = useTheme();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shake = useSharedValue(0);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleOtpChange = useCallback(
    (value: string, index: number) => {
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      
      // Handle paste
      if (value.length > 1) {
        const pastedOtp = value.slice(0, OTP_LENGTH).split('');
        pastedOtp.forEach((digit, i) => {
          if (i < OTP_LENGTH) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const lastIndex = Math.min(value.length - 1, OTP_LENGTH - 1);
        inputRefs.current[lastIndex]?.focus();
        setActiveIndex(lastIndex);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }

      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Auto-submit when complete
      if (value && index === OTP_LENGTH - 1) {
        const completeOtp = newOtp.join('');
        if (completeOtp.length === OTP_LENGTH) {
          Keyboard.dismiss();
          handleVerify(completeOtp);
        }
      }
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [otp]
  );

  const handleVerify = useCallback(
    async (otpValue: string) => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Simulate error for demo (remove in production)
        if (otpValue === '000000') {
          setError('Invalid OTP. Please try again.');
          shake.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onVerify(otpValue);
        }
      }, 1500);
    },
    [onVerify, shake]
  );

  const handleResend = useCallback(() => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(new Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
    setActiveIndex(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onResend();
  }, [resendTimer, onResend]);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const maskedPhone = phoneNumber.replace(/(\d{2})(\d{5})(\d{3})/, '+91 $1*****$3');

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[themeColors.primary.purple, themeColors.primary.blue]}
            style={styles.iconGradient}
          >
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text variant="h2" align="center" style={styles.title}>
          Verify Your Number
        </Text>
        <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text variant="bodyMedium" color="primary">
            {maskedPhone}
          </Text>
        </Text>

        {/* OTP Input */}
        <Animated.View style={[styles.otpContainer, animatedShakeStyle]}>
          {otp.map((digit, index) => {
            const isFocused = activeIndex === index;
            const isFilled = digit !== '';

            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: error
                      ? themeColors.semantic.error
                      : isFocused
                      ? primary.purple
                      : isFilled
                      ? colors.border
                      : colors.borderLight,
                  },
                ]}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, { color: colors.text }]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setActiveIndex(index)}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  selectTextOnFocus
                  selectionColor={primary.purple}
                />
                {isFocused && !digit && (
                  <View style={[styles.cursor, { backgroundColor: primary.purple }]} />
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Error */}
        {error ? (
          <Text variant="bodySmall" color="error" align="center" style={styles.error}>
            {error}
          </Text>
        ) : null}

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text variant="body" color="secondary">
            Didn't receive the code?{' '}
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0}
            activeOpacity={0.7}
          >
            <Text
              variant="bodyMedium"
              color={resendTimer > 0 ? 'tertiary' : 'accent'}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify button */}
        <Button
          label="Verify"
          onPress={() => handleVerify(otp.join(''))}
          loading={isLoading}
          disabled={otp.join('').length !== OTP_LENGTH}
          fullWidth
          style={styles.verifyButton}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing['2xl'],
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    borderRadius: 1,
  },
  error: {
    marginBottom: spacing.md,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  verifyButton: {
    width: '100%',
  },
});

export default OTPScreen;

