/**
 * Login Screen
 * Premium login with phone/social auth options
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Input, Button, Divider } from '@components/base';
import { Logo } from '@components/shared';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLogin: (phone: string, password: string) => void;
  onSignupPress: () => void;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
}

const SocialButton: React.FC<{
  icon: 'logo-google' | 'logo-apple';
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.socialButtonWrapper, animatedStyle]}>
      <TouchableOpacity
        style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Ionicons
          name={icon}
          size={20}
          color={icon === 'logo-apple' ? colors.text : undefined}
        />
        <Text variant="bodyMedium" style={styles.socialButtonText}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignupPress,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
}) => {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: { phone?: string; password?: string } = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [phone, password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(phone, password);
    }, 1500);
  }, [validateForm, phone, password, onLogin]);

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(155, 109, 255, 0.08)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo size="large" />
        </View>

        {/* Welcome text */}
        <View style={styles.welcomeContainer}>
          <Text variant="h1" align="center">
            Welcome Back
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
            Sign in to continue your journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Input
            label="PHONE NUMBER"
            placeholder="Enter your mobile number"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <Input
            label="PASSWORD"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon="lock-closed-outline"
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotButton}>
            <Text variant="bodySmall" color="accent">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        {/* Divider */}
        <Divider label="or continue with" spacing="large" />

        {/* Social login */}
        <View style={styles.socialContainer}>
          <SocialButton
            icon="logo-google"
            label="Google"
            onPress={onGoogleLogin}
          />
          <SocialButton
            icon="logo-apple"
            label="Apple"
            onPress={onAppleLogin}
          />
        </View>

        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text variant="body" color="secondary">
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onSignupPress}>
            <Text variant="bodyMedium" color="accent">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width + 100,
    height: 400,
    borderRadius: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  welcomeContainer: {
    marginBottom: spacing['2xl'],
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  formContainer: {
    marginBottom: spacing.lg,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  socialButtonWrapper: {
    flex: 1,
    maxWidth: 160,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  socialButtonText: {
    marginLeft: spacing.xs,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
});

export default LoginScreen;

