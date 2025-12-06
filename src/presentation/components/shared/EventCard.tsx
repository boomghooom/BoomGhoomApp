/**
 * EventCard Component
 * Beautiful event card for listings
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, Badge, Avatar, AvatarGroup, Card } from '../base';
import {
  useTheme,
  spacing,
  borderRadius,
  colors as themeColors,
} from '@theme/index';
import { EventSummary, getEventCategoryIcon } from '@domain/entities';

interface EventCardProps {
  event: EventSummary;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  style?: ViewStyle;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  variant = 'default',
  style,
}) => {
  const { colors, gradients, semantic } = useTheme();

  const formattedDate = useMemo(() => {
    const date = new Date(event.startTime);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      time: date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' }),
    };
  }, [event.startTime]);

  const spotsText = useMemo(() => {
    const remaining = event.memberLimit - event.participantCount;
    if (remaining <= 0) return 'Full';
    if (remaining <= 5) return `${remaining} spots left`;
    return `${event.participantCount}/${event.memberLimit}`;
  }, [event.participantCount, event.memberLimit]);

  const priceText = useMemo(() => {
    if (event.pricing.isFree) return 'Free';
    return `₹${event.pricing.price}`;
  }, [event.pricing]);

  if (variant === 'compact') {
    return (
      <Card variant="default" onPress={onPress} padding="none" style={[styles.compactCard, style]}>
        <View style={styles.compactContainer}>
          <Image
            source={{ uri: event.coverImageUrl || 'https://via.placeholder.com/80' }}
            style={styles.compactImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.compactContent}>
            <Text variant="bodyMedium" numberOfLines={1}>
              {event.title}
            </Text>
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {event.location.venueName}
            </Text>
            <View style={styles.compactFooter}>
              <View style={styles.compactDateContainer}>
                <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                <Text variant="caption" color="tertiary" style={styles.compactDateText}>
                  {formattedDate.month} {formattedDate.day} • {formattedDate.time}
                </Text>
              </View>
              <Badge
                label={priceText}
                variant={event.pricing.isFree ? 'success' : 'default'}
                size="small"
              />
            </View>
          </View>
        </View>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card variant="default" onPress={onPress} padding="none" style={[styles.featuredCard, style]}>
        <View style={styles.featuredImageContainer}>
          <Image
            source={{ uri: event.coverImageUrl || 'https://via.placeholder.com/400x250' }}
            style={styles.featuredImage}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.featuredOverlay}
          />
          {event.type === 'sponsored' && (
            <Badge
              label="Sponsored"
              variant="gradient"
              size="small"
              style={styles.sponsoredBadge}
            />
          )}
          <View style={styles.featuredDateBadge}>
            <Text variant="h4" style={styles.featuredDateDay}>
              {formattedDate.day}
            </Text>
            <Text variant="tiny" style={styles.featuredDateMonth}>
              {formattedDate.month}
            </Text>
          </View>
          <View style={styles.featuredContentOverlay}>
            <Text variant="h3" style={styles.featuredTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.featuredMeta}>
              <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text variant="bodySmall" style={styles.featuredLocation}>
                {event.location.venueName}, {event.location.city}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.featuredFooter}>
          <View style={styles.featuredStats}>
            <View style={styles.statItem}>
              <Ionicons
                name={getEventCategoryIcon(event.category) as keyof typeof Ionicons.glyphMap}
                size={16}
                color={themeColors.primary.purple}
              />
              <Text variant="caption" color="secondary">
                {spotsText}
              </Text>
            </View>
            {event.distance !== undefined && (
              <View style={styles.statItem}>
                <Ionicons name="navigate-outline" size={16} color={themeColors.primary.orange} />
                <Text variant="caption" color="secondary">
                  {event.distance.toFixed(1)} km
                </Text>
              </View>
            )}
          </View>
          <Badge
            label={priceText}
            variant={event.pricing.isFree ? 'success' : 'gradient'}
            size="medium"
          />
        </View>
      </Card>
    );
  }

  // Default variant
  return (
    <Card variant="default" onPress={onPress} padding="none" style={[styles.defaultCard, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.coverImageUrl || 'https://via.placeholder.com/300x160' }}
          style={styles.defaultImage}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.imageOverlay}
        />
        {event.type === 'sponsored' && (
          <Badge
            label="Sponsored"
            variant="gradient"
            size="small"
            style={styles.typeBadge}
          />
        )}
        <View style={styles.dateBadge}>
          <Text variant="bodyMedium" style={styles.dateDay}>
            {formattedDate.day}
          </Text>
          <Text variant="tiny" style={styles.dateMonth}>
            {formattedDate.month}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.categoryRow}>
          <Ionicons
            name={getEventCategoryIcon(event.category) as keyof typeof Ionicons.glyphMap}
            size={14}
            color={themeColors.primary.purple}
          />
          <Text variant="caption" color="accent" style={styles.categoryText}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Text>
        </View>
        <Text variant="h4" numberOfLines={2} style={styles.title}>
          {event.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <Text variant="bodySmall" color="tertiary" numberOfLines={1} style={styles.locationText}>
            {event.location.venueName}, {event.location.city}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text variant="caption" color="secondary">
              {formattedDate.time} • {spotsText}
            </Text>
          </View>
          <Badge
            label={priceText}
            variant={event.pricing.isFree ? 'success' : 'outlined'}
            size="small"
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // Default styles
  defaultCard: {
    width: 280,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  dateBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    alignItems: 'center',
    minWidth: 40,
  },
  dateDay: {
    color: '#1A1A24',
    fontWeight: '700',
  },
  dateMonth: {
    color: '#5A5A6B',
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  categoryText: {
    marginLeft: spacing.xxs,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    marginLeft: spacing.xxs,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {},

  // Compact styles
  compactCard: {
    borderRadius: borderRadius.md,
  },
  compactContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.sm,
  },
  compactContent: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  compactDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactDateText: {
    marginLeft: spacing.xxs,
  },

  // Featured styles
  featuredCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    height: 220,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sponsoredBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  featuredDateBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    minWidth: 50,
  },
  featuredDateDay: {
    color: '#1A1A24',
    fontWeight: '700',
  },
  featuredDateMonth: {
    color: '#5A5A6B',
    fontWeight: '600',
  },
  featuredContentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  featuredTitle: {
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLocation: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: spacing.xxs,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  featuredStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});

export default EventCard;

