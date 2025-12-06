/**
 * BoomGhoom App
 * Main application entry point
 */

import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, LogBox, Text as RNText } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider, colors } from './src/presentation/theme';
import { useAuthStore } from './src/presentation/store';

// Lazy load screens to debug
const SplashScreenComponent = React.lazy(() => import('./src/presentation/screens/auth/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingScreen = React.lazy(() => import('./src/presentation/screens/auth/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const LoginScreen = React.lazy(() => import('./src/presentation/screens/auth/LoginScreen').then(m => ({ default: m.LoginScreen })));
const SignupScreen = React.lazy(() => import('./src/presentation/screens/auth/SignupScreen').then(m => ({ default: m.SignupScreen })));
const OTPScreen = React.lazy(() => import('./src/presentation/screens/auth/OTPScreen').then(m => ({ default: m.OTPScreen })));
const CitySelectionScreen = React.lazy(() => import('./src/presentation/screens/auth/CitySelectionScreen').then(m => ({ default: m.CitySelectionScreen })));
const HomeScreen = React.lazy(() => import('./src/presentation/screens/main/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ProfileScreen = React.lazy(() => import('./src/presentation/screens/main/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const SettingsScreen = React.lazy(() => import('./src/presentation/screens/main/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const NotificationsScreen = React.lazy(() => import('./src/presentation/screens/main/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const EventDetailScreen = React.lazy(() => import('./src/presentation/screens/event/EventDetailScreen').then(m => ({ default: m.EventDetailScreen })));
const CreateEventScreen = React.lazy(() => import('./src/presentation/screens/event/CreateEventScreen').then(m => ({ default: m.CreateEventScreen })));
const WalletScreen = React.lazy(() => import('./src/presentation/screens/finance/WalletScreen').then(m => ({ default: m.WalletScreen })));
const FriendsScreen = React.lazy(() => import('./src/presentation/screens/social/FriendsScreen').then(m => ({ default: m.FriendsScreen })));
const ChatScreen = React.lazy(() => import('./src/presentation/screens/social/ChatScreen').then(m => ({ default: m.ChatScreen })));
const KYCIntroScreen = React.lazy(() => import('./src/presentation/screens/kyc/KYCIntroScreen').then(m => ({ default: m.KYCIntroScreen })));
const KYCSelfieScreen = React.lazy(() => import('./src/presentation/screens/kyc/KYCSelfieScreen').then(m => ({ default: m.KYCSelfieScreen })));
const KYCSuccessScreen = React.lazy(() => import('./src/presentation/screens/kyc/KYCSuccessScreen').then(m => ({ default: m.KYCSuccessScreen })));
const MainNavigator = React.lazy(() => import('./src/presentation/navigation/MainNavigator').then(m => ({ default: m.MainNavigator })));

// Ignore specific warnings in development
LogBox.ignoreLogs(['Reanimated 2']);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Custom navigation theme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.text,
    border: colors.dark.border,
    primary: colors.primary.purple,
  },
};

type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'otp'
  | 'citySelection'
  | 'kycIntro'
  | 'kycSelfie'
  | 'kycSuccess'
  | 'main'
  | 'eventDetail'
  | 'createEvent'
  | 'settings'
  | 'notifications'
  | 'wallet'
  | 'friends'
  | 'chat';

// Loading fallback
const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <RNText style={styles.loadingText}>Loading...</RNText>
  </View>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { isAuthenticated, isOnboardingComplete, setOnboardingComplete, setUser } = useAuthStore();

  useEffect(() => {
    // Hide native splash screen
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  // Handle splash completion
  const handleSplashFinish = useCallback(() => {
    if (isAuthenticated) {
      setCurrentScreen('main');
    } else if (isOnboardingComplete) {
      setCurrentScreen('login');
    } else {
      setCurrentScreen('onboarding');
    }
  }, [isAuthenticated, isOnboardingComplete]);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback(() => {
    setOnboardingComplete(true);
    setCurrentScreen('login');
  }, [setOnboardingComplete]);

  // Handle login
  const handleLogin = useCallback((phone: string, _password: string) => {
    setPhoneNumber(phone);
    setCurrentScreen('otp');
  }, []);

  // Handle signup
  const handleSignup = useCallback((data: { phone: string }) => {
    setPhoneNumber(data.phone);
    setCurrentScreen('otp');
  }, []);

  // Handle OTP verification
  const handleOTPVerify = useCallback((_otp: string) => {
    setCurrentScreen('citySelection');
  }, []);

  // Handle city selection
  const handleCitySelected = useCallback((city: { name: string; state: string }) => {
    // Set mock user
    setUser({
      id: '1',
      phoneNumber,
      fullName: 'John Doe',
      displayName: 'John',
      location: {
        latitude: 19.076,
        longitude: 72.8777,
        city: city.name,
        state: city.state,
        country: 'India',
      },
      kyc: { status: 'not_started' },
      finance: {
        dues: 0,
        pendingCommission: 0,
        availableCommission: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      },
      stats: {
        eventsJoined: 0,
        eventsCreated: 0,
        eventsCompleted: 0,
        friendsCount: 0,
        averageRating: 0,
        totalRatings: 0,
      },
      referralCode: 'JOHND123',
      isOnline: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setCurrentScreen('main');
  }, [phoneNumber, setUser]);

  // Render current screen
  const renderScreen = () => {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        {currentScreen === 'splash' && (
          <SplashScreenComponent onFinish={handleSplashFinish} />
        )}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        {currentScreen === 'login' && (
          <LoginScreen
            onLogin={handleLogin}
            onSignupPress={() => setCurrentScreen('signup')}
            onForgotPassword={() => {}}
            onGoogleLogin={() => setCurrentScreen('citySelection')}
            onAppleLogin={() => setCurrentScreen('citySelection')}
          />
        )}
        {currentScreen === 'signup' && (
          <SignupScreen
            onSignup={handleSignup}
            onLoginPress={() => setCurrentScreen('login')}
            onGoogleSignup={() => setCurrentScreen('citySelection')}
            onAppleSignup={() => setCurrentScreen('citySelection')}
          />
        )}
        {currentScreen === 'otp' && (
          <OTPScreen
            phoneNumber={phoneNumber}
            onVerify={handleOTPVerify}
            onResend={() => {}}
            onBack={() => setCurrentScreen('login')}
          />
        )}
        {currentScreen === 'citySelection' && (
          <CitySelectionScreen
            onCitySelected={handleCitySelected}
            onBack={() => setCurrentScreen('login')}
          />
        )}
        {currentScreen === 'kycIntro' && (
          <KYCIntroScreen
            onStart={() => setCurrentScreen('kycSelfie')}
            onSkip={() => setCurrentScreen('main')}
            onBack={() => setCurrentScreen('main')}
          />
        )}
        {currentScreen === 'kycSelfie' && (
          <KYCSelfieScreen
            onCapture={() => setCurrentScreen('kycSuccess')}
            onBack={() => setCurrentScreen('kycIntro')}
          />
        )}
        {currentScreen === 'kycSuccess' && (
          <KYCSuccessScreen onContinue={() => setCurrentScreen('main')} />
        )}
        {currentScreen === 'main' && (
          <MainNavigator
            onCreateEvent={() => setCurrentScreen('createEvent')}
            onEventPress={(eventId) => {
              setSelectedEventId(eventId);
              setCurrentScreen('eventDetail');
            }}
            onNotifications={() => setCurrentScreen('notifications')}
            onSettings={() => setCurrentScreen('settings')}
            onWallet={() => setCurrentScreen('wallet')}
            onFriends={() => setCurrentScreen('friends')}
            onEditProfile={() => {}}
            onFriendChat={(friendId) => {
              setSelectedChatId(friendId);
              setCurrentScreen('chat');
            }}
            notificationCount={3}
          />
        )}
        {currentScreen === 'eventDetail' && (
          <EventDetailScreen
            eventId={selectedEventId || '1'}
            onBack={() => setCurrentScreen('main')}
            onJoin={() => {}}
            onLeave={() => {}}
            onAdminPress={() => {}}
            onParticipantPress={() => {}}
            onReport={() => {}}
          />
        )}
        {currentScreen === 'createEvent' && (
          <CreateEventScreen
            onBack={() => setCurrentScreen('main')}
            onCreate={() => setCurrentScreen('main')}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={() => setCurrentScreen('main')}
            onEditProfile={() => {}}
            onLogout={() => {
              setUser(null);
              setCurrentScreen('login');
            }}
          />
        )}
        {currentScreen === 'notifications' && (
          <NotificationsScreen
            onBack={() => setCurrentScreen('main')}
            onNotificationPress={() => {}}
          />
        )}
        {currentScreen === 'wallet' && (
          <WalletScreen
            onBack={() => setCurrentScreen('main')}
            onWithdraw={() => {}}
            onClearDues={() => {}}
            onTransactionPress={() => {}}
          />
        )}
        {currentScreen === 'friends' && (
          <FriendsScreen
            onBack={() => setCurrentScreen('main')}
            onFriendPress={() => {}}
            onChatPress={(friendId) => {
              setSelectedChatId(friendId);
              setCurrentScreen('chat');
            }}
          />
        )}
        {currentScreen === 'chat' && (
          <ChatScreen
            chatId={selectedChatId || 'chat1'}
            onBack={() => setCurrentScreen('friends')}
            onProfilePress={() => {}}
          />
        )}
      </React.Suspense>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider initialTheme="dark">
          <NavigationContainer theme={CustomDarkTheme}>
            <StatusBar style="light" />
            {renderScreen()}
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
