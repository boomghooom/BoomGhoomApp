/**
 * Friends Screen
 * Friend list with search and friend requests
 */

import React, { useState, useCallback, useMemo } from 'react';
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

import { Text, Avatar, IconButton, Input, Badge, Card, Button } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { Friend, FriendRequest } from '@domain/entities';

// Mock data
const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    displayName: 'Priya Sharma',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
    averageRating: 4.8,
    friendsSince: '2023-06-15',
    mutualEventsCount: 5,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: '2',
    displayName: 'Rahul Verma',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    gender: 'male',
    isOnline: false,
    averageRating: 4.9,
    friendsSince: '2023-08-20',
    mutualEventsCount: 8,
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    displayName: 'Sneha Patel',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    gender: 'female',
    isOnline: true,
    averageRating: 4.6,
    friendsSince: '2023-10-01',
    mutualEventsCount: 3,
  },
  {
    id: '4',
    displayName: 'Amit Kumar',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    gender: 'male',
    isOnline: false,
    averageRating: 4.7,
    friendsSince: '2023-11-10',
    mutualEventsCount: 2,
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_REQUESTS: FriendRequest[] = [
  {
    id: '1',
    fromUser: {
      id: '5',
      displayName: 'Neha Gupta',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      isOnline: true,
      averageRating: 4.5,
    },
    toUserId: 'current-user',
    eventId: '123',
    eventTitle: 'Sunday Football Match',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    fromUser: {
      id: '6',
      displayName: 'Karan Singh',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
      isOnline: false,
      averageRating: 4.3,
    },
    toUserId: 'current-user',
    eventId: '124',
    eventTitle: 'Rooftop Sunset Party',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

interface FriendsScreenProps {
  onBack: () => void;
  onFriendPress: (friendId: string) => void;
  onChatPress: (friendId: string) => void;
}

const FriendItem: React.FC<{
  friend: Friend;
  onPress: () => void;
  onChat: () => void;
  index: number;
}> = ({ friend, onPress, onChat, index }) => {
  const { colors, primary } = useTheme();

  const getLastActive = () => {
    if (friend.isOnline) return 'Online';
    if (!friend.lastActiveAt) return 'Offline';
    const diff = Date.now() - new Date(friend.lastActiveAt).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Active recently';
    if (hours < 24) return `Active ${hours}h ago`;
    return 'Active 1d+ ago';
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      exiting={FadeOutLeft}
    >
      <TouchableOpacity
        style={[styles.friendItem, { borderBottomColor: colors.border }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.7}
      >
        <Avatar
          source={friend.avatarUrl}
          name={friend.displayName}
          size="medium"
          showOnline
          isOnline={friend.isOnline}
        />
        <View style={styles.friendContent}>
          <Text variant="bodyMedium">{friend.displayName}</Text>
          <Text variant="caption" color="tertiary">
            {getLastActive()} • {friend.mutualEventsCount} events together
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: `${primary.purple}15` }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChat();
          }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={primary.purple} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RequestItem: React.FC<{
  request: FriendRequest;
  onAccept: () => void;
  onReject: () => void;
}> = ({ request, onAccept, onReject }) => {
  const { colors, primary, semantic } = useTheme();

  return (
    <Card variant="default" style={styles.requestCard}>
      <View style={styles.requestContent}>
        <Avatar
          source={request.fromUser.avatarUrl}
          name={request.fromUser.displayName}
          size="medium"
          showOnline
          isOnline={request.fromUser.isOnline}
        />
        <View style={styles.requestInfo}>
          <Text variant="bodyMedium">{request.fromUser.displayName}</Text>
          <Text variant="caption" color="secondary">
            From "{request.eventTitle}"
          </Text>
        </View>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={[styles.requestButton, styles.rejectButton, { borderColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onReject();
          }}
        >
          <Text variant="bodySmall" color="secondary">
            Decline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.requestButton, styles.acceptButton, { backgroundColor: primary.purple }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onAccept();
          }}
        >
          <Text variant="bodySmall" style={{ color: '#FFFFFF' }}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  onBack,
  onFriendPress,
  onChatPress,
}) => {
  const { colors, primary } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_FRIENDS;
    const query = searchQuery.toLowerCase();
    return MOCK_FRIENDS.filter((f) => f.displayName.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleAcceptRequest = useCallback((requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    // In real app, call API and add to friends list
  }, []);

  const handleRejectRequest = useCallback((requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        <Text variant="h3">Friends</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <FriendItem
            friend={item}
            onPress={() => onFriendPress(item.id)}
            onChat={() => onChatPress(item.id)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={primary.purple} />
        }
        ListHeaderComponent={
          requests.length > 0 ? (
            <View style={styles.requestsSection}>
              <View style={styles.sectionHeader}>
                <Text variant="label" color="secondary">
                  FRIEND REQUESTS
                </Text>
                <Badge label={requests.length.toString()} variant="error" size="small" />
              </View>
              {requests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  onAccept={() => handleAcceptRequest(request.id)}
                  onReject={() => handleRejectRequest(request.id)}
                />
              ))}
              <View style={styles.sectionDivider}>
                <Text variant="label" color="secondary">
                  ALL FRIENDS ({filteredFriends.length})
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.sectionDivider}>
              <Text variant="label" color="secondary">
                ALL FRIENDS ({filteredFriends.length})
              </Text>
            </View>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text variant="body" color="tertiary" align="center">
              {searchQuery ? 'No friends found' : 'No friends yet'}
            </Text>
            <Text variant="bodySmall" color="muted" align="center">
              Join events to meet new people!
            </Text>
          </View>
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  requestsSection: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  requestCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requestInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  requestButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  rejectButton: {
    borderWidth: 1,
  },
  acceptButton: {},
  sectionDivider: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  friendContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
});

export default FriendsScreen;

