/**
 * ScreenContainer Component
 * Base layout wrapper for all screens with safe areas and theming
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, screenPadding, spacing } from '@theme/index';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeTop?: boolean;
  safeBottom?: boolean;
  padding?: boolean;
  keyboardAvoiding?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  safeTop = true,
  safeBottom = true,
  padding = true,
  keyboardAvoiding = false,
  gradient = false,
  style,
  contentStyle,
  headerComponent,
  footerComponent,
}) => {
  const { colors, gradients, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    ...style,
  };

  const contentPadding: ViewStyle = padding
    ? {
        paddingHorizontal: screenPadding.horizontal,
      }
    : {};

  const safeAreaPadding: ViewStyle = {
    paddingTop: safeTop ? insets.top : 0,
    paddingBottom: safeBottom ? insets.bottom : 0,
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            contentPadding,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.content, contentPadding, contentStyle]}>
        {children}
      </View>
    );
  };

  const renderWithKeyboardAvoiding = (content: React.ReactNode) => {
    if (!keyboardAvoiding) return content;

    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {content}
      </KeyboardAvoidingView>
    );
  };

  const innerContent = (
    <View style={[containerStyle, safeAreaPadding]}>
      {headerComponent}
      {renderContent()}
      {footerComponent}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradients.darkBackground as unknown as string[]}
        style={styles.gradient}
      >
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        {renderWithKeyboardAvoiding(innerContent)}
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {renderWithKeyboardAvoiding(innerContent)}
    </>
  );
};

// Header Component for screens
interface ScreenHeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  transparent = false,
  style,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: transparent ? 'transparent' : colors.background,
        },
        style,
      ]}
    >
      <View style={styles.headerLeft}>{leftComponent}</View>
      {title && (
        <View style={styles.headerCenter}>
          {/* Using inline styles to avoid circular imports */}
          <View>
            <View />
          </View>
        </View>
      )}
      <View style={styles.headerRight}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default ScreenContainer;

