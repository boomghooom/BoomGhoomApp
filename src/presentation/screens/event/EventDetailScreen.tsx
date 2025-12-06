/**
 * Event Detail Screen
 * Full event information with join/leave actions
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Button, Avatar, AvatarGroup, Badge, Card, IconButton, Divider } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { Event, EventCategory, getEventCategoryIcon, getEventCategoryLabel } from '@domain/entities';

const { width, height } = Dimensions.get('window');

// Mock event data
const MOCK_EVENT: Event = {
  id: '1',
  type: 'user_created',
  status: 'upcoming',
  category: 'sports',
  title: 'Sunday Football Match',
  description:
    'Join us for a friendly 11-a-side football match at Central Park! All skill levels welcome. We\'ll divide into teams based on experience. Bring your A-game and make new friends while enjoying the beautiful game. Water and snacks will be provided. Don\'t forget to wear comfortable sports gear and football boots!',
  location: {
    latitude: 19.076,
    longitude: 72.8777,
    address: '123 Sports Complex, Andheri West',
    venueName: 'Central Park Stadium',
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  startTime: new Date(Date.now() + 172800000).toISOString(),
  endTime: new Date(Date.now() + 172800000 + 7200000).toISOString(),
  imageUrls: [
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  ],
  coverImageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
  admin: {
    id: '2',
    displayName: 'Rahul Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    averageRating: 4.9,
    eventsCreated: 24,
    isKYCVerified: true,
  },
  eligibility: {
    genderAllowed: ['male', 'female', 'other'],
    minAge: 18,
    maxAge: 45,
    maxDistance: 25,
    memberLimit: 22,
    requiresApproval: true,
  },
  pricing: {
    isFree: true,
    currency: 'INR',
    includesGST: false,
  },
  coupons: [],
  rules: [
    'Arrive 15 minutes before start time',
    'Wear proper sports gear and football boots',
    'No aggressive behavior',
    'Respect all participants',
    'Follow the admin\'s instructions',
  ],
  participants: [
    { id: '3', displayName: 'Amit', avatarUrl: 'https://i.pravatar.cc/150?img=3', isOnline: true, averageRating: 4.5 },
    { id: '4', displayName: 'Priya', avatarUrl: 'https://i.pravatar.cc/150?img=4', isOnline: false, averageRating: 4.8 },
    { id: '5', displayName: 'Vikram', avatarUrl: 'https://i.pravatar.cc/150?img=5', isOnline: true, averageRating: 4.2 },
  ],
  participantCount: 18,
  waitlistCount: 3,
  genderRatio: { male: 12, female: 6, other: 0 },
  averageAge: 28,
  totalDuesGenerated: 450,
  isJoined: false,
  isPendingApproval: false,
  isWaitlisted: false,
  canLeave: true,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
};

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
  onJoin: () => void;
  onLeave: () => void;
  onAdminPress: (adminId: string) => void;
  onParticipantPress: (userId: string) => void;
  onReport: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onBack,
  onJoin,
  onLeave,
  onAdminPress,
  onParticipantPress,
  onReport,
}) => {
  const { colors, primary, gradients, semantic } = useTheme();
  const insets = useSafeAreaInsets();
  const [event] = useState<Event>(MOCK_EVENT);
  const [isJoining, setIsJoining] = useState(false);

  const formattedDate = useMemo(() => {
    const date = new Date(event.startTime);
    return {
      full: date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [event.startTime]);

  const spotsLeft = event.eligibility.memberLimit - event.participantCount;

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out "${event.title}" on BoomGhoom! Join me for this amazing event. 🎉`,
        url: `https://boomghoom.app/event/${event.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [event]);

  const handleJoin = useCallback(async () => {
    setIsJoining(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      Alert.alert(
        'Request Sent',
        event.eligibility.requiresApproval
          ? 'Your join request has been sent to the admin for approval.'
          : 'You have successfully joined this event!',
        [{ text: 'OK' }]
      );
      onJoin();
    }, 1500);
  }, [event, onJoin]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: event.coverImageUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.coverOverlay}
          />

          {/* Header buttons */}
          <View style={[styles.headerButtons, { paddingTop: insets.top + spacing.sm }]}>
            <IconButton icon="arrow-back" variant="blur" onPress={onBack} />
            <View style={styles.headerRight}>
              <IconButton icon="share-outline" variant="blur" onPress={handleShare} />
              <IconButton icon="flag-outline" variant="blur" onPress={onReport} />
            </View>
          </View>

          {/* Event badges */}
          <View style={styles.eventBadges}>
            {event.type === 'sponsored' && (
              <Badge label="Sponsored" variant="gradient" size="small" />
            )}
            <Badge
              label={getEventCategoryLabel(event.category)}
              variant="default"
              size="small"
              icon={
                <Ionicons
                  name={getEventCategoryIcon(event.category) as keyof typeof Ionicons.glyphMap}
                  size={12}
                  color={colors.textSecondary}
                />
              }
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Text variant="h1" style={styles.title}>
              {event.title}
            </Text>
          </Animated.View>

          {/* Quick info */}
          <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color={primary.purple} />
              <Text variant="body" style={styles.infoText}>
                {formattedDate.full}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color={primary.orange} />
              <Text variant="body" style={styles.infoText}>
                {formattedDate.time}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={18} color={primary.magenta} />
              <Text variant="body" style={styles.infoText} numberOfLines={1}>
                {event.location.venueName}
              </Text>
            </View>
          </Animated.View>

          {/* Admin card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <TouchableOpacity
              style={[styles.adminCard, { backgroundColor: colors.surface }]}
              onPress={() => onAdminPress(event.admin.id)}
              activeOpacity={0.7}
            >
              <Avatar
                source={event.admin.avatarUrl}
                name={event.admin.displayName}
                size="medium"
              />
              <View style={styles.adminInfo}>
                <View style={styles.adminNameRow}>
                  <Text variant="bodyMedium">{event.admin.displayName}</Text>
                  {event.admin.isKYCVerified && (
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color={semantic.success}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text variant="caption" color="secondary">
                  Organizer • {event.admin.eventsCreated} events hosted
                </Text>
              </View>
              <View style={styles.adminRating}>
                <Ionicons name="star" size={14} color={themeColors.events.sponsored} />
                <Text variant="bodySmall">{event.admin.averageRating}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <Text variant="h3" color="accent">
                {event.participantCount}/{event.eligibility.memberLimit}
              </Text>
              <Text variant="caption" color="secondary">
                Joined
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <View style={styles.genderRatio}>
                <Text variant="bodySmall" style={{ color: themeColors.gender.male }}>
                  {event.genderRatio.male}M
                </Text>
                <Text variant="bodySmall" color="muted"> : </Text>
                <Text variant="bodySmall" style={{ color: themeColors.gender.female }}>
                  {event.genderRatio.female}F
                </Text>
              </View>
              <Text variant="caption" color="secondary">
                Gender Ratio
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <Text variant="h3">{event.averageAge}</Text>
              <Text variant="caption" color="secondary">
                Avg. Age
              </Text>
            </View>
          </Animated.View>

          <Divider spacing="large" />

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text variant="h4" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="body" color="secondary" style={styles.description}>
              {event.description}
            </Text>
          </Animated.View>

          <Divider spacing="large" />

          {/* Rules */}
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <Text variant="h4" style={styles.sectionTitle}>
              Rules
            </Text>
            {event.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <View style={[styles.ruleBullet, { backgroundColor: primary.purple }]}>
                  <Text variant="tiny" style={{ color: '#FFFFFF' }}>
                    {index + 1}
                  </Text>
                </View>
                <Text variant="body" color="secondary" style={styles.ruleText}>
                  {rule}
                </Text>
              </View>
            ))}
          </Animated.View>

          <Divider spacing="large" />

          {/* Participants */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.sectionHeader}>
              <Text variant="h4">Participants</Text>
              <TouchableOpacity>
                <Text variant="bodySmall" color="accent">
                  See all ({event.participantCount})
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.participantsList}>
              <AvatarGroup
                avatars={event.participants.map((p) => ({
                  source: p.avatarUrl,
                  name: p.displayName,
                }))}
                max={5}
                size="medium"
              />
              {spotsLeft > 0 && (
                <Text variant="bodySmall" color="secondary" style={styles.spotsText}>
                  {spotsLeft} spots left
                </Text>
              )}
            </View>
          </Animated.View>

          <Divider spacing="large" />

          {/* Location */}
          <Animated.View entering={FadeInDown.delay(450).springify()}>
            <Text variant="h4" style={styles.sectionTitle}>
              Location
            </Text>
            <Card variant="default" style={styles.locationCard}>
              <View style={styles.locationContent}>
                <View style={[styles.locationIcon, { backgroundColor: `${primary.purple}20` }]}>
                  <Ionicons name="location" size={24} color={primary.purple} />
                </View>
                <View style={styles.locationInfo}>
                  <Text variant="bodyMedium">{event.location.venueName}</Text>
                  <Text variant="bodySmall" color="secondary">
                    {event.location.address}
                  </Text>
                  <Text variant="caption" color="tertiary">
                    {event.location.city}, {event.location.state}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.directionsButton, { backgroundColor: colors.background }]}
              >
                <Ionicons name="navigate" size={16} color={primary.purple} />
                <Text variant="bodySmall" color="accent">
                  Get Directions
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <Animated.View
        entering={FadeInUp.delay(500).springify()}
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md, backgroundColor: colors.background }]}
      >
        <View style={styles.footerContent}>
          <View style={styles.priceContainer}>
            {event.pricing.isFree ? (
              <Text variant="h2" style={{ color: semantic.success }}>
                Free
              </Text>
            ) : (
              <Text variant="h2">₹{event.pricing.price}</Text>
            )}
            <Text variant="caption" color="secondary">
              {spotsLeft} spots left
            </Text>
          </View>
          <Button
            label={
              event.isJoined
                ? 'Leave Event'
                : event.isPendingApproval
                ? 'Pending...'
                : event.eligibility.requiresApproval
                ? 'Request to Join'
                : 'Join Now'
            }
            variant={event.isJoined ? 'outline' : 'primary'}
            onPress={event.isJoined ? onLeave : handleJoin}
            loading={isJoining}
            disabled={event.isPendingApproval || spotsLeft === 0}
            style={styles.joinButton}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  eventBadges: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  quickInfo: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  adminInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  adminNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  genderRatio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    lineHeight: 24,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  ruleBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  ruleText: {
    flex: 1,
    lineHeight: 22,
  },
  participantsList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotsText: {
    marginLeft: spacing.md,
  },
  locationCard: {
    padding: spacing.md,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  priceContainer: {},
  joinButton: {
    minWidth: 160,
  },
});

export default EventDetailScreen;

