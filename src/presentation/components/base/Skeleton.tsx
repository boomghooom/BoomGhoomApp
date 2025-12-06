/**
 * Skeleton Component
 * Loading placeholders with shimmer effect
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { useTheme, borderRadius } from '@theme/index';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}) => {
  const { colors } = useTheme();
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerPosition.value,
          [0, 1],
          [-200, 200]
        ),
      },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.shimmer,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.05)',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

// Preset skeleton components
export const SkeletonText: React.FC<{ lines?: number; lastLineWidth?: string }> = ({
  lines = 3,
  lastLineWidth = '60%',
}) => {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={14}
          style={styles.textLine}
        />
      ))}
    </View>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
};

export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 200 }) => {
  return (
    <View style={styles.cardContainer}>
      <Skeleton height={height * 0.6} borderRadius={borderRadius.lg} />
      <View style={styles.cardContent}>
        <Skeleton width="70%" height={18} style={styles.cardTitle} />
        <Skeleton width="50%" height={14} />
      </View>
    </View>
  );
};

export const SkeletonListItem: React.FC = () => {
  return (
    <View style={styles.listItemContainer}>
      <SkeletonAvatar size={48} />
      <View style={styles.listItemContent}>
        <Skeleton width="60%" height={16} style={styles.listItemTitle} />
        <Skeleton width="80%" height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
  },
  gradient: {
    flex: 1,
  },
  textContainer: {
    gap: 8,
  },
  textLine: {
    marginBottom: 4,
  },
  cardContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
    gap: 8,
  },
  cardTitle: {
    marginBottom: 4,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  listItemTitle: {
    marginBottom: 2,
  },
});

export default Skeleton;

