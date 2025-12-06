/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import {
  HomeScreen,
  ProfileScreen,
  NotificationsScreen,
  SettingsScreen,
} from '@screens/main';
import { FriendsScreen } from '@screens/social';
import { useTheme, spacing, colors as themeColors } from '@theme/index';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface MainNavigatorProps {
  onCreateEvent: () => void;
  onEventPress: (eventId: string) => void;
  onNotifications: () => void;
  onSettings: () => void;
  onWallet: () => void;
  onFriends: () => void;
  onEditProfile: () => void;
  onFriendChat: (friendId: string) => void;
  notificationCount?: number;
}

export const MainNavigator: React.FC<MainNavigatorProps> = ({
  onCreateEvent,
  onEventPress,
  onNotifications,
  onSettings,
  onWallet,
  onFriends,
  onEditProfile,
  onFriendChat,
  notificationCount = 0,
}) => {
  const { colors, primary, theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme === 'dark' ? 'rgba(18, 18, 26, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: spacing.xs,
        },
        tabBarActiveTintColor: primary.purple,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Explore':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Friends':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        children={() => (
          <HomeScreen
            onEventPress={onEventPress}
            onCreateEvent={onCreateEvent}
            onNotifications={onNotifications}
            onSearch={() => {}}
            notificationCount={notificationCount}
          />
        )}
      />
      <Tab.Screen
        name="Explore"
        children={() => (
          <HomeScreen
            onEventPress={onEventPress}
            onCreateEvent={onCreateEvent}
            onNotifications={onNotifications}
            onSearch={() => {}}
          />
        )}
      />
      <Tab.Screen
        name="Create"
        children={() => <View style={{ flex: 1, backgroundColor: colors.background }} />}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onCreateEvent();
          },
        }}
      />
      <Tab.Screen
        name="Friends"
        children={() => (
          <FriendsScreen
            onBack={() => {}}
            onFriendPress={(friendId) => {}}
            onChatPress={onFriendChat}
          />
        )}
      />
      <Tab.Screen
        name="Profile"
        children={() => (
          <ProfileScreen
            onEditProfile={onEditProfile}
            onSettings={onSettings}
            onWallet={onWallet}
            onFriends={onFriends}
            onEventHistory={() => {}}
            onShare={() => {}}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

