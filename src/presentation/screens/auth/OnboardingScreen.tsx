/**
 * Onboarding Screen
 * Premium swipeable onboarding with animations
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { Text, Button } from '@components/base';
import { LogoIcon } from '@components/shared';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'compass-outline',
    title: 'Discover Local Events',
    description:
      'Explore amazing group activities and events happening around you. From sports to nightlife, find your vibe.',
    gradient: [themeColors.primary.orange, themeColors.primary.magenta],
  },
  {
    id: '2',
    icon: 'people-outline',
    title: 'Connect With People',
    description:
      'Meet like-minded people in your city. Join groups, make friends, and create lasting memories together.',
    gradient: [themeColors.primary.magenta, themeColors.primary.purple],
  },
  {
    id: '3',
    icon: 'rocket-outline',
    title: 'Host Your Own Events',
    description:
      'Become an event creator, earn commissions, and build your community. Your next adventure starts here.',
    gradient: [themeColors.primary.purple, themeColors.primary.blue],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SlideItem: React.FC<{
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({ item, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }], opacity };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, 30],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <LinearGradient
          colors={item.gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={item.icon} size={64} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text variant="display3" align="center" style={styles.title}>
          {item.title}
        </Text>
        <Text
          variant="bodyLarge"
          color="secondary"
          align="center"
          style={styles.description}
        >
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
};

const Pagination: React.FC<{
  data: OnboardingSlide[];
  scrollX: Animated.SharedValue<number>;
}> = ({ data, scrollX }) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const animatedDotStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP
          );
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
          );
          return { width: dotWidth, opacity };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: themeColors.primary.purple },
              animatedDotStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  }, [currentIndex, onComplete]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleScroll = useCallback((event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  }, [scrollX]);

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LogoIcon size={32} />
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text variant="bodyMedium" color="secondary">
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination */}
      <Pagination data={slides} scrollX={scrollX} />

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label={currentIndex === slides.length - 1 ? "Let's Go!" : 'Continue'}
          onPress={handleNext}
          fullWidth
          icon={currentIndex === slides.length - 1 ? 'arrow-forward' : undefined}
          iconPosition="right"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  skipButton: {
    padding: spacing.xs,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing['3xl'],
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    paddingHorizontal: spacing.lg,
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
  },
});

export default OnboardingScreen;

