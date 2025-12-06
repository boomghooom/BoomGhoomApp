/**
 * Navigation Types
 * Type definitions for all navigation routes
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { phoneNumber: string };
  CitySelection: undefined;
};

// KYC Stack
export type KYCStackParamList = {
  KYCIntro: undefined;
  KYCSelfie: undefined;
  KYCSuccess: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Create: undefined;
  Friends: undefined;
  Profile: undefined;
};

// Event Stack
export type EventStackParamList = {
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  EventHistory: undefined;
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

// Finance Stack
export type FinanceStackParamList = {
  Wallet: undefined;
  Withdraw: undefined;
  ClearDues: undefined;
  TransactionDetail: { transactionId: string };
};

// Social Stack
export type SocialStackParamList = {
  FriendsList: undefined;
  Chat: { chatId: string; friendId?: string };
  UserProfile: { userId: string };
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  KYC: NavigatorScreenParams<KYCStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Event: NavigatorScreenParams<EventStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  Finance: NavigatorScreenParams<FinanceStackParamList>;
  Social: NavigatorScreenParams<SocialStackParamList>;
};

// Helper types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

