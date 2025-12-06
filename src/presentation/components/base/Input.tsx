/**
 * Input Component
 * Premium text input with validation and icons
 */

import React, { useState, useCallback, forwardRef, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import { Text } from './Text';
import { useTheme, spacing, borderRadius, typography, colors as themeColors } from '@theme/index';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  disabled?: boolean;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      disabled = false,
      secureTextEntry = false,
      containerStyle,
      inputStyle,
      ...props
    },
    ref
  ) => {
    const { colors, theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    const focusAnimation = useSharedValue(0);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      focusAnimation.value = withTiming(1, { duration: 200 });
    }, [focusAnimation]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      focusAnimation.value = withTiming(0, { duration: 200 });
    }, [focusAnimation]);

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    const animatedBorderStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusAnimation.value,
        [0, 1],
        [
          error ? themeColors.semantic.error : colors.border,
          error ? themeColors.semantic.error : themeColors.primary.purple,
        ]
      );
      return { borderColor };
    });

    const iconColor = useMemo(() => {
      if (error) return themeColors.semantic.error;
      if (isFocused) return themeColors.primary.purple;
      return colors.textTertiary;
    }, [error, isFocused, colors]);

    const showPasswordToggle = secureTextEntry;
    const actualSecureEntry = secureTextEntry && !isPasswordVisible;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text variant="label" color="secondary" style={styles.label}>
            {label}
          </Text>
        )}
        <AnimatedView
          style={[
            styles.inputContainer,
            {
              backgroundColor: disabled ? colors.disabled : colors.surface,
            },
            animatedBorderStyle,
          ]}
        >
          {leftIcon && (
            <Ionicons name={leftIcon} size={20} color={iconColor} style={styles.leftIcon} />
          )}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              typography.input,
              { color: disabled ? colors.disabledText : colors.text },
              leftIcon && styles.inputWithLeftIcon,
              (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
              inputStyle,
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            secureTextEntry={actualSecureEntry}
            selectionColor={themeColors.primary.purple}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.rightIconContainer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
          {rightIcon && !showPasswordToggle && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={styles.rightIconContainer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={rightIcon} size={20} color={iconColor} />
            </TouchableOpacity>
          )}
        </AnimatedView>
        {(error || hint) && (
          <Text
            variant="caption"
            color={error ? 'error' : 'tertiary'}
            style={styles.helperText}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xxs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIconContainer: {
    padding: spacing.xxs,
    marginLeft: spacing.xs,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xxs,
  },
});

export default Input;

