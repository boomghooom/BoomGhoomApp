/**
 * Home Screen
 * Interactive map with event discovery
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, IconButton, Badge, Avatar } from '@components/base';
import { EventCard, LogoIcon } from '@components/shared';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { EventSummary, EventCategory, getEventCategoryIcon, getEventCategoryLabel } from '@domain/entities';

const { width, height } = Dimensions.get('window');

// Mock data
const MOCK_EVENTS: EventSummary[] = [
  {
    id: '1',
    type: 'sponsored',
    status: 'upcoming',
    category: 'nightlife',
    title: 'Rooftop Sunset Party',
    coverImageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    location: { venueName: 'Sky Lounge', city: 'Mumbai' },
    startTime: new Date(Date.now() + 86400000).toISOString(),
    participantCount: 45,
    memberLimit: 100,
    pricing: { isFree: false, price: 999, currency: 'INR', includesGST: true },
    distance: 2.3,
  },
  {
    id: '2',
    type: 'user_created',
    status: 'upcoming',
    category: 'sports',
    title: 'Sunday Football Match',
    coverImageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    location: { venueName: 'Central Park', city: 'Mumbai' },
    startTime: new Date(Date.now() + 172800000).toISOString(),
    participantCount: 18,
    memberLimit: 22,
    pricing: { isFree: true, currency: 'INR', includesGST: false },
    distance: 0.8,
  },
  {
    id: '3',
    type: 'user_created',
    status: 'upcoming',
    category: 'food',
    title: 'Street Food Crawl',
    coverImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    location: { venueName: 'Mohammed Ali Road', city: 'Mumbai' },
    startTime: new Date(Date.now() + 259200000).toISOString(),
    participantCount: 12,
    memberLimit: 15,
    pricing: { isFree: true, currency: 'INR', includesGST: false },
    distance: 4.1,
  },
];

const CATEGORIES: EventCategory[] = [
  'sports',
  'music',
  'food',
  'nightlife',
  'fitness',
  'outdoor',
  'games',
  'travel',
  'art',
  'tech',
  'networking',
];

interface HomeScreenProps {
  onEventPress: (eventId: string) => void;
  onCreateEvent: () => void;
  onNotifications: () => void;
  onSearch: () => void;
  notificationCount?: number;
}

const CategoryPill: React.FC<{
  category: EventCategory;
  selected: boolean;
  onSelect: () => void;
}> = ({ category, selected, onSelect }) => {
  const { colors, primary } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        {
          backgroundColor: selected ? primary.purple : colors.surface,
          borderColor: selected ? primary.purple : colors.border,
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
      }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getEventCategoryIcon(category) as keyof typeof Ionicons.glyphMap}
        size={16}
        color={selected ? '#FFFFFF' : colors.textSecondary}
      />
      <Text
        variant="bodySmall"
        style={{ color: selected ? '#FFFFFF' : colors.textSecondary, marginLeft: 6 }}
      >
        {getEventCategoryLabel(category)}
      </Text>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onEventPress,
  onCreateEvent,
  onNotifications,
  onSearch,
  notificationCount = 0,
}) => {
  const { colors, primary, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapRef = useRef<MapView>(null);
  const bottomSheetY = useSharedValue(0);

  const initialRegion = {
    latitude: 19.076,
    longitude: 72.8777,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return MOCK_EVENTS;
    return MOCK_EVENTS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  const handleMarkerPress = useCallback(
    (eventId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onEventPress(eventId);
    },
    [onEventPress]
  );

  const toggleMapExpand = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMapExpanded(!mapExpanded);
  }, [mapExpanded]);

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map */}
      <View style={[styles.mapContainer, mapExpanded && styles.mapExpanded]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
          customMapStyle={theme === 'dark' ? darkMapStyle : []}
        >
          {MOCK_EVENTS.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: 19.076 + Math.random() * 0.05 - 0.025,
                longitude: 72.8777 + Math.random() * 0.05 - 0.025,
              }}
              onPress={() => handleMarkerPress(event.id)}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor:
                      event.type === 'sponsored'
                        ? themeColors.events.sponsored
                        : primary.purple,
                  },
                ]}
              >
                <Ionicons
                  name={getEventCategoryIcon(event.category) as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Map overlay header */}
        <View style={[styles.mapHeader, { paddingTop: insets.top + spacing.sm }]}>
          <BlurView intensity={60} tint={theme} style={styles.mapHeaderBlur}>
            <View style={styles.mapHeaderContent}>
              <View style={styles.mapHeaderLeft}>
                <LogoIcon size={28} />
                <View style={styles.locationBadge}>
                  <Ionicons name="location" size={14} color={primary.purple} />
                  <Text variant="bodySmall" style={styles.locationText}>
                    Mumbai
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </View>
              </View>
              <View style={styles.mapHeaderRight}>
                <IconButton
                  icon="search-outline"
                  variant="ghost"
                  onPress={onSearch}
                />
                <IconButton
                  icon="notifications-outline"
                  variant="ghost"
                  onPress={onNotifications}
                  badge={notificationCount}
                />
              </View>
            </View>
          </BlurView>
        </View>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <IconButton
            icon={mapExpanded ? 'contract-outline' : 'expand-outline'}
            variant="blur"
            onPress={toggleMapExpand}
          />
          <IconButton
            icon="locate-outline"
            variant="blur"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mapRef.current?.animateToRegion(initialRegion, 500);
            }}
          />
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 80,
          },
          bottomSheetStyle,
        ]}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            <CategoryPill
              category="sports"
              selected={selectedCategory === null}
              onSelect={() => setSelectedCategory(null)}
            />
            {CATEGORIES.map((category) => (
              <CategoryPill
                key={category}
                category={category}
                selected={selectedCategory === category}
                onSelect={() =>
                  setSelectedCategory(selectedCategory === category ? null : category)
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Events section */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">Nearby Events</Text>
            <TouchableOpacity>
              <Text variant="bodySmall" color="accent">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredEvents}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsList}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => onEventPress(item.id)}
                style={styles.eventCard}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Featured events */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">Featured</Text>
            <Badge label="Sponsored" variant="gradient" size="small" />
          </View>

          {MOCK_EVENTS.filter((e) => e.type === 'sponsored').map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="featured"
              onPress={() => onEventPress(event.id)}
              style={styles.featuredCard}
            />
          ))}
        </View>
      </Animated.View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 96 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onCreateEvent();
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[themeColors.primary.orange, themeColors.primary.magenta]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Dark map style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.45,
  },
  mapExpanded: {
    height: height * 0.7,
  },
  map: {
    flex: 1,
  },
  mapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  mapHeaderBlur: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  mapHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mapHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontWeight: '600',
  },
  mapHeaderRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  mapControls: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    gap: spacing.xs,
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheet: {
    flex: 1,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    marginTop: -spacing.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  categoriesContainer: {
    paddingBottom: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  eventsSection: {
    paddingTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  eventsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  eventCard: {
    marginRight: spacing.md,
  },
  featuredCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: themeColors.primary.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;

