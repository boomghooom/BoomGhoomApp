/**
 * Divider Component
 * Visual separators for content sections
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { Text } from './Text';
import { useTheme, spacing } from '@theme/index';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  spacing: spacingProp = 'medium',
  label,
  style,
}) => {
  const { colors } = useTheme();

  const spacingValues = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  };

  const spacingValue = spacingValues[spacingProp];

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: thickness,
            backgroundColor: colors.border,
            marginHorizontal: spacingValue,
          },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        style={[
          styles.horizontalWithLabel,
          { marginVertical: spacingValue },
          style,
        ]}
      >
        <View
          style={[
            styles.horizontalLine,
            { height: thickness, backgroundColor: colors.border },
          ]}
        />
        <Text variant="caption" color="tertiary" style={styles.label}>
          {label}
        </Text>
        <View
          style={[
            styles.horizontalLine,
            { height: thickness, backgroundColor: colors.border },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          height: thickness,
          backgroundColor: colors.border,
          marginVertical: spacingValue,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
  horizontalWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalLine: {
    flex: 1,
  },
  label: {
    marginHorizontal: spacing.md,
  },
});

export default Divider;

