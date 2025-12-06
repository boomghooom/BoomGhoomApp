/**
 * Signup Screen
 * Premium registration with step-by-step flow
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Text, Input, Button, IconButton, Divider } from '@components/base';
import { LogoIcon } from '@components/shared';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { Gender } from '@domain/entities';

interface SignupScreenProps {
  onSignup: (data: SignupData) => void;
  onLoginPress: () => void;
  onGoogleSignup: () => void;
  onAppleSignup: () => void;
}

export interface SignupData {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  gender?: Gender;
  referralCode?: string;
}

const GenderOption: React.FC<{
  value: Gender;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onSelect: (value: Gender) => void;
}> = ({ value, label, icon, selected, onSelect }) => {
  const { colors, primary } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.genderOption,
        {
          backgroundColor: selected ? 'rgba(155, 109, 255, 0.15)' : colors.surface,
          borderColor: selected ? primary.purple : colors.border,
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(value);
      }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={24}
        color={selected ? primary.purple : colors.textSecondary}
      />
      <Text
        variant="bodySmall"
        color={selected ? 'accent' : 'secondary'}
        style={styles.genderLabel}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignup,
  onLoginPress,
  onGoogleSignup,
  onAppleSignup,
}) => {
  const { colors, primary } = useTheme();
  const [formData, setFormData] = useState<SignupData>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    gender: undefined,
    referralCode: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateField = useCallback((field: keyof SignupData, value: string | Gender) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, confirmPassword, agreedToTerms]);

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignup(formData);
    }, 1500);
  }, [validateForm, formData, onSignup]);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { level: 0, label: '', color: colors.textMuted };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { label: 'Weak', color: themeColors.semantic.error },
      { label: 'Fair', color: themeColors.semantic.warning },
      { label: 'Good', color: themeColors.semantic.info },
      { label: 'Strong', color: themeColors.semantic.success },
    ];

    return { level: strength, ...levels[Math.min(strength - 1, 3)] };
  }, [formData.password, colors]);

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LogoIcon size={36} />
            <View style={styles.headerTextContainer}>
              <Text variant="h1">Create Account</Text>
              <Text variant="body" color="secondary">
                Join the community
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="FULL NAME"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              error={errors.fullName}
              leftIcon="person-outline"
              autoCapitalize="words"
              autoComplete="name"
            />

            <Input
              label="PHONE NUMBER"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              error={errors.phone}
              leftIcon="call-outline"
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            <Input
              label="EMAIL (OPTIONAL)"
              placeholder="Enter your email address"
              value={formData.email || ''}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="PASSWORD"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              leftIcon="lock-closed-outline"
              secureTextEntry
              autoComplete="new-password"
            />

            {/* Password strength indicator */}
            {formData.password && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3, 4].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            level <= passwordStrength.level
                              ? passwordStrength.color
                              : colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text variant="caption" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}

            <Input
              label="CONFIRM PASSWORD"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              error={errors.confirmPassword}
              leftIcon="shield-checkmark-outline"
              secureTextEntry
              autoComplete="new-password"
            />

            {/* Gender selection */}
            <View style={styles.genderContainer}>
              <Text variant="label" color="secondary" style={styles.genderTitle}>
                GENDER (OPTIONAL)
              </Text>
              <View style={styles.genderOptions}>
                <GenderOption
                  value="male"
                  label="Male"
                  icon="male-outline"
                  selected={formData.gender === 'male'}
                  onSelect={(value) => updateField('gender', value)}
                />
                <GenderOption
                  value="female"
                  label="Female"
                  icon="female-outline"
                  selected={formData.gender === 'female'}
                  onSelect={(value) => updateField('gender', value)}
                />
                <GenderOption
                  value="other"
                  label="Other"
                  icon="transgender-outline"
                  selected={formData.gender === 'other'}
                  onSelect={(value) => updateField('gender', value)}
                />
              </View>
            </View>

            <Input
              label="REFERRAL CODE (OPTIONAL)"
              placeholder="Enter referral code if you have one"
              value={formData.referralCode || ''}
              onChangeText={(value) => updateField('referralCode', value)}
              leftIcon="gift-outline"
              autoCapitalize="characters"
            />

            {/* Terms */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreedToTerms
                      ? primary.purple
                      : 'transparent',
                    borderColor: errors.terms
                      ? themeColors.semantic.error
                      : agreedToTerms
                      ? primary.purple
                      : colors.border,
                  },
                ]}
              >
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text variant="bodySmall" color="secondary" style={styles.termsText}>
                I agree to the{' '}
                <Text variant="bodySmallMedium" color="accent">
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text variant="bodySmallMedium" color="accent">
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text variant="caption" color="error" style={styles.termsError}>
                {errors.terms}
              </Text>
            )}

            <Button
              label="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              fullWidth
              style={styles.signupButton}
            />
          </View>

          {/* Divider */}
          <Divider label="or sign up with" spacing="large" />

          {/* Social buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface }]}
              onPress={onGoogleSignup}
            >
              <Ionicons name="logo-google" size={20} />
              <Text variant="bodyMedium" style={styles.socialText}>
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface }]}
              onPress={onAppleSignup}
            >
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text variant="bodyMedium" style={styles.socialText}>
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.loginContainer}>
            <Text variant="body" color="secondary">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onLoginPress}>
              <Text variant="bodyMedium" color="accent">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  headerTextContainer: {
    marginTop: spacing.md,
  },
  form: {
    marginBottom: spacing.lg,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    marginLeft: spacing.xxs,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginRight: spacing.sm,
  },
  strengthBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  genderContainer: {
    marginBottom: spacing.md,
  },
  genderTitle: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xxs,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  genderLabel: {
    marginTop: spacing.xxs,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  termsError: {
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
    marginLeft: spacing.xxs,
  },
  signupButton: {
    marginTop: spacing.md,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  socialText: {
    marginLeft: spacing.xs,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
});

export default SignupScreen;

