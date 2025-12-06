/**
 * Profile Screen
 * User profile with stats, events history, and settings
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Avatar, Badge, Card, IconButton, Divider } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { User, KYCStatus } from '@domain/entities';

const { width } = Dimensions.get('window');

// Mock user data
const MOCK_USER: User = {
  id: '1',
  phoneNumber: '9876543210',
  email: 'john@example.com',
  fullName: 'John Doe',
  displayName: 'John',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  dateOfBirth: '1995-06-15',
  gender: 'male',
  bio: 'Adventure seeker | Tech enthusiast | Love meeting new people',
  location: {
    latitude: 19.076,
    longitude: 72.8777,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
  },
  kyc: {
    status: 'verified',
    verifiedAt: '2024-01-15',
  },
  finance: {
    dues: 0,
    pendingCommission: 1250,
    availableCommission: 3500,
    totalEarned: 15000,
    totalWithdrawn: 10250,
  },
  stats: {
    eventsJoined: 24,
    eventsCreated: 8,
    eventsCompleted: 20,
    friendsCount: 156,
    averageRating: 4.8,
    totalRatings: 45,
  },
  referralCode: 'JOHND123',
  isOnline: true,
  createdAt: '2023-06-01',
  updatedAt: '2024-01-20',
};

interface ProfileScreenProps {
  onEditProfile: () => void;
  onSettings: () => void;
  onWallet: () => void;
  onFriends: () => void;
  onEventHistory: () => void;
  onShare: () => void;
}

const StatCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color: string;
  onPress?: () => void;
}> = ({ icon, value, label, color, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text variant="h3">{value}</Text>
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const MenuItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeColor?: string;
}> = ({ icon, label, value, onPress, showBadge, badgeColor }) => {
  const { colors, primary } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name={icon} size={20} color={primary.purple} />
      </View>
      <View style={styles.menuContent}>
        <Text variant="body">{label}</Text>
        {value && (
          <Text variant="bodySmall" color="secondary">
            {value}
          </Text>
        )}
      </View>
      <View style={styles.menuRight}>
        {showBadge && (
          <View style={[styles.menuBadge, { backgroundColor: badgeColor || themeColors.semantic.error }]} />
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onEditProfile,
  onSettings,
  onWallet,
  onFriends,
  onEventHistory,
  onShare,
}) => {
  const { colors, primary, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const user = MOCK_USER;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header */}
        <LinearGradient
          colors={gradients.darkBackground as unknown as string[]}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <Text variant="h3">Profile</Text>
            <View style={styles.topBarRight}>
              <IconButton icon="share-outline" variant="ghost" onPress={onShare} />
              <IconButton icon="settings-outline" variant="ghost" onPress={onSettings} />
            </View>
          </View>

          {/* Profile info */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.profileInfo}>
            <TouchableOpacity onPress={onEditProfile} activeOpacity={0.8}>
              <Avatar
                source={user.avatarUrl}
                name={user.fullName}
                size="huge"
                showOnline
                isOnline={user.isOnline}
                showBorder
              />
              <View style={styles.editAvatarButton}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text variant="h2">{user.fullName}</Text>
                {user.kyc.status === 'verified' && (
                  <Ionicons
                    name="shield-checkmark"
                    size={20}
                    color={themeColors.semantic.success}
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
              <Text variant="body" color="secondary">
                @{user.displayName?.toLowerCase()}
              </Text>
              {user.bio && (
                <Text variant="bodySmall" color="tertiary" style={styles.bio}>
                  {user.bio}
                </Text>
              )}
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={themeColors.events.sponsored} />
              <Text variant="bodyMedium" style={styles.ratingText}>
                {user.stats.averageRating.toFixed(1)}
              </Text>
              <Text variant="bodySmall" color="secondary">
                ({user.stats.totalRatings} ratings)
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
          <StatCard
            icon="calendar-outline"
            value={user.stats.eventsJoined}
            label="Events Joined"
            color={themeColors.primary.purple}
            onPress={onEventHistory}
          />
          <StatCard
            icon="add-circle-outline"
            value={user.stats.eventsCreated}
            label="Events Created"
            color={themeColors.primary.orange}
            onPress={onEventHistory}
          />
          <StatCard
            icon="people-outline"
            value={user.stats.friendsCount}
            label="Friends"
            color={themeColors.primary.blue}
            onPress={onFriends}
          />
        </Animated.View>

        {/* Wallet card */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.walletSection}>
          <TouchableOpacity activeOpacity={0.9} onPress={onWallet}>
            <LinearGradient
              colors={[themeColors.primary.purple, themeColors.primary.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.walletCard}
            >
              <View style={styles.walletHeader}>
                <View style={styles.walletTitleRow}>
                  <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
                  <Text variant="bodyMedium" style={styles.walletTitle}>
                    My Wallet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.walletContent}>
                <View style={styles.walletItem}>
                  <Text variant="caption" style={styles.walletLabel}>
                    Available
                  </Text>
                  <Text variant="h2" style={styles.walletAmount}>
                    ₹{user.finance.availableCommission.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.walletDivider} />
                <View style={styles.walletItem}>
                  <Text variant="caption" style={styles.walletLabel}>
                    Pending
                  </Text>
                  <Text variant="h3" style={styles.walletAmountSmall}>
                    ₹{user.finance.pendingCommission.toLocaleString()}
                  </Text>
                </View>
                {user.finance.dues > 0 && (
                  <>
                    <View style={styles.walletDivider} />
                    <View style={styles.walletItem}>
                      <Text variant="caption" style={styles.walletLabel}>
                        Dues
                      </Text>
                      <Text variant="h3" style={[styles.walletAmountSmall, { color: themeColors.semantic.error }]}>
                        ₹{user.finance.dues}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.menuSection}>
          <Card variant="default" padding="none">
            <MenuItem
              icon="time-outline"
              label="Event History"
              value={`${user.stats.eventsCompleted} completed`}
              onPress={onEventHistory}
            />
            <MenuItem
              icon="people-outline"
              label="Friends"
              value={`${user.stats.friendsCount} friends`}
              onPress={onFriends}
            />
            <MenuItem
              icon="gift-outline"
              label="Referral Code"
              value={user.referralCode}
              onPress={() => {}}
            />
            <MenuItem
              icon="star-outline"
              label="Ratings & Reviews"
              value={`${user.stats.averageRating} avg`}
              onPress={() => {}}
            />
          </Card>
        </Animated.View>

        {/* Account section */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.menuSection}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            ACCOUNT
          </Text>
          <Card variant="default" padding="none">
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              onPress={onEditProfile}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              label="KYC Verification"
              value={user.kyc.status === 'verified' ? 'Verified' : 'Pending'}
              onPress={() => {}}
            />
            <MenuItem
              icon="settings-outline"
              label="Settings"
              onPress={onSettings}
            />
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />
          </Card>
        </Animated.View>
      </ScrollView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  profileInfo: {
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: themeColors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A0A0F',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: spacing.xs,
  },
  bio: {
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xxs,
  },
  ratingText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  walletSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  walletCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  walletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  walletTitle: {
    color: '#FFFFFF',
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  walletItem: {
    flex: 1,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xxs,
  },
  walletAmount: {
    color: '#FFFFFF',
  },
  walletAmountSmall: {
    color: '#FFFFFF',
  },
  walletDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.md,
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ProfileScreen;

