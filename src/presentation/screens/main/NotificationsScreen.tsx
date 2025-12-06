/**
 * Notifications Screen
 * Grouped notifications with actions
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Avatar, Card, IconButton, Badge } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import {
  Notification,
  NotificationType,
  getNotificationIcon,
  getNotificationColor,
} from '@domain/entities';

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'event_join_approved',
    title: 'Join Request Approved',
    body: 'Your request to join "Sunday Football Match" has been approved!',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    type: 'friend_request',
    title: 'New Friend Request',
    body: 'Priya Sharma wants to be your friend',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'event_reminder',
    title: 'Event Tomorrow',
    body: '"Rooftop Sunset Party" starts tomorrow at 6:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=100',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'commission_available',
    title: 'Commission Available',
    body: '₹850 commission from "Street Food Crawl" is now available for withdrawal',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    type: 'friend_event_created',
    title: 'Friend Created Event',
    body: 'Rahul Verma created "Beach Volleyball Tournament"',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

interface NotificationsScreenProps {
  onBack: () => void;
  onNotificationPress: (notification: Notification) => void;
}

const NotificationItem: React.FC<{
  notification: Notification;
  onPress: () => void;
  index: number;
}> = ({ notification, onPress, index }) => {
  const { colors, primary, semantic } = useTheme();
  const iconName = getNotificationIcon(notification.type);
  const colorType = getNotificationColor(notification.type);

  const getColorValue = () => {
    switch (colorType) {
      case 'success':
        return semantic.success;
      case 'warning':
        return semantic.warning;
      case 'error':
        return semantic.error;
      default:
        return primary.purple;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      exiting={FadeOutLeft}
    >
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: notification.isRead ? 'transparent' : colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.7}
      >
        {/* Icon or Image */}
        <View style={styles.notificationLeft}>
          {notification.imageUrl ? (
            <Avatar source={notification.imageUrl} size="medium" />
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getColorValue()}20` },
              ]}
            >
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={20}
                color={getColorValue()}
              />
            </View>
          )}
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: primary.purple }]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.notificationContent}>
          <Text
            variant={notification.isRead ? 'body' : 'bodyMedium'}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            variant="bodySmall"
            color="secondary"
            numberOfLines={2}
            style={styles.notificationBody}
          >
            {notification.body}
          </Text>
          <Text variant="caption" color="tertiary">
            {formatTime(notification.createdAt)}
          </Text>
        </View>

        {/* Action indicator */}
        <View style={styles.notificationRight}>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onNotificationPress,
}) => {
  const { colors, primary } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      onNotificationPress(notification);
    },
    [onNotificationPress]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
        <Ionicons name="notifications-off-outline" size={48} color={colors.textTertiary} />
      </View>
      <Text variant="h4" align="center" style={styles.emptyTitle}>
        No Notifications
      </Text>
      <Text variant="body" color="secondary" align="center">
        You're all caught up! Check back later for updates.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerLeft}>
          <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        </View>
        <View style={styles.headerCenter}>
          <Text variant="h3">Notifications</Text>
          {unreadCount > 0 && (
            <Badge label={unreadCount.toString()} variant="error" size="small" style={styles.headerBadge} />
          )}
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text variant="bodySmall" color="accent">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications list */}
      <FlatList
        data={notifications}
        renderItem={({ item, index }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={primary.purple}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    width: 80,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  headerBadge: {
    marginLeft: spacing.xxs,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  listContentEmpty: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notificationLeft: {
    position: 'relative',
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0A0A0F',
  },
  notificationContent: {
    flex: 1,
  },
  notificationBody: {
    marginVertical: spacing.xxs,
  },
  notificationRight: {
    paddingTop: spacing.xxs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
});

export default NotificationsScreen;

