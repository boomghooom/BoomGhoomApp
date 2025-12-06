/**
 * Settings Screen
 * App settings and preferences
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Text, Card, IconButton, Divider, Avatar } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

interface SettingsScreenProps {
  onBack: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  danger = false,
  toggle = false,
  toggleValue,
  onToggle,
}) => {
  const { colors, primary } = useTheme();

  const handlePress = () => {
    if (toggle && onToggle) {
      onToggle(!toggleValue);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={handlePress}
      disabled={!onPress && !toggle}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.settingIconContainer,
          {
            backgroundColor: danger
              ? themeColors.semantic.errorLight
              : `${primary.purple}15`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? themeColors.semantic.error : primary.purple}
        />
      </View>
      <View style={styles.settingContent}>
        <Text variant="body" color={danger ? 'error' : 'primary'}>
          {label}
        </Text>
        {value && (
          <Text variant="bodySmall" color="tertiary">
            {value}
          </Text>
        )}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{
            false: colors.border,
            true: `${primary.purple}50`,
          }}
          thumbColor={toggleValue ? primary.purple : colors.textTertiary}
        />
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      ) : null}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onEditProfile,
  onLogout,
}) => {
  const { colors, theme, toggleTheme, primary } = useTheme();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [friendActivityEnabled, setFriendActivityEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onLogout();
          },
        },
      ],
      { cancelable: true }
    );
  }, [onLogout]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        <Text variant="h3">Settings</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['3xl'] }}
      >
        {/* Account */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            ACCOUNT
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="person-outline"
              label="Edit Profile"
              onPress={onEditProfile}
            />
            <SettingItem
              icon="call-outline"
              label="Phone Number"
              value="+91 98765*****"
              onPress={() => {}}
            />
            <SettingItem
              icon="mail-outline"
              label="Email"
              value="john@example.com"
              onPress={() => {}}
            />
            <SettingItem
              icon="key-outline"
              label="Change Password"
              onPress={() => {}}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              label="KYC Status"
              value="Verified"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            NOTIFICATIONS
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="notifications-outline"
              label="Push Notifications"
              toggle
              toggleValue={notificationsEnabled}
              onToggle={setNotificationsEnabled}
            />
            <SettingItem
              icon="people-outline"
              label="Friend Activity"
              toggle
              toggleValue={friendActivityEnabled}
              onToggle={setFriendActivityEnabled}
            />
            <SettingItem
              icon="megaphone-outline"
              label="Marketing"
              toggle
              toggleValue={marketingEnabled}
              onToggle={setMarketingEnabled}
            />
          </Card>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            PRIVACY
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="location-outline"
              label="Location Services"
              toggle
              toggleValue={locationEnabled}
              onToggle={setLocationEnabled}
            />
            <SettingItem
              icon="eye-outline"
              label="Profile Visibility"
              value="Everyone"
              onPress={() => {}}
            />
            <SettingItem
              icon="ban-outline"
              label="Blocked Users"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            APPEARANCE
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
              label="Dark Mode"
              toggle
              toggleValue={theme === 'dark'}
              onToggle={toggleTheme}
            />
            <SettingItem
              icon="language-outline"
              label="Language"
              value="English"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Payments */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            PAYMENTS
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="card-outline"
              label="Saved Cards"
              onPress={() => {}}
            />
            <SettingItem
              icon="wallet-outline"
              label="Bank Account"
              value="HDFC ****1234"
              onPress={() => {}}
            />
            <SettingItem
              icon="receipt-outline"
              label="Transaction History"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            SUPPORT
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => {}}
            />
            <SettingItem
              icon="chatbubble-outline"
              label="Contact Us"
              onPress={() => {}}
            />
            <SettingItem
              icon="bug-outline"
              label="Report a Bug"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            LEGAL
          </Text>
          <Card variant="default" padding="none">
            <SettingItem
              icon="document-text-outline"
              label="Terms of Service"
              onPress={() => {}}
            />
            <SettingItem
              icon="shield-outline"
              label="Privacy Policy"
              onPress={() => {}}
            />
            <SettingItem
              icon="information-circle-outline"
              label="About"
              value="v1.0.0"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Danger zone */}
        <View style={styles.section}>
          <Card variant="default" padding="none">
            <SettingItem
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
            <SettingItem
              icon="trash-outline"
              label="Delete Account"
              onPress={handleDeleteAccount}
              showArrow={false}
              danger
            />
          </Card>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
});

export default SettingsScreen;

