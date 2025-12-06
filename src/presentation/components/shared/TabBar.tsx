/**
 * Custom TabBar Component
 * Premium bottom navigation with animations
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, CountBadge } from '../base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

interface TabItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

const TabButton: React.FC<{
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
}> = ({ tab, isActive, onPress }) => {
  const { colors, primary } = useTheme();
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, colorProgress]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.textTertiary, primary.purple]
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabContent, animatedContainerStyle]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isActive ? tab.iconFocused : tab.icon}
            size={24}
            color={isActive ? primary.purple : colors.textTertiary}
          />
          {tab.badge !== undefined && tab.badge > 0 && (
            <View style={styles.badge}>
              <CountBadge count={tab.badge} size="small" />
            </View>
          )}
        </View>
        <Text
          variant="tab"
          style={[
            styles.tabLabel,
            { color: isActive ? primary.purple : colors.textTertiary },
          ]}
        >
          {tab.label}
        </Text>
        {isActive && <View style={[styles.indicator, { backgroundColor: primary.purple }]} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingBottom: Math.max(insets.bottom, spacing.sm),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <BlurView
        intensity={theme === 'dark' ? 60 : 90}
        tint={theme}
        style={styles.blurContainer}
      >
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor:
                theme === 'dark' ? 'rgba(18, 18, 26, 0.85)' : 'rgba(255, 255, 255, 0.9)',
              borderTopColor: colors.border,
            },
          ]}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              onPress={() => onTabPress(tab.key)}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.xxs,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  tabLabel: {
    marginTop: 2,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xxs,
  },
});

export default TabBar;

