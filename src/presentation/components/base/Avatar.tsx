/**
 * Avatar Component
 * User avatar with online status, fallback initials, and press states
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from './Text';
import { useTheme, borderRadius, componentSpacing, colors as themeColors } from '@theme/index';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'huge';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  isOnline?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  borderColor?: string;
  showBorder?: boolean;
}

const SIZES: Record<AvatarSize, number> = {
  tiny: 24,
  small: 32,
  medium: 40,
  large: 48,
  xlarge: 64,
  huge: 80,
};

const FONT_SIZES: Record<AvatarSize, 'micro' | 'tiny' | 'caption' | 'bodySmall' | 'body' | 'h3'> = {
  tiny: 'micro',
  small: 'tiny',
  medium: 'caption',
  large: 'bodySmall',
  xlarge: 'body',
  huge: 'h3',
};

const STATUS_SIZES: Record<AvatarSize, number> = {
  tiny: 6,
  small: 8,
  medium: 10,
  large: 12,
  xlarge: 14,
  huge: 16,
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'medium',
  showOnline = false,
  isOnline = false,
  onPress,
  style,
  borderColor,
  showBorder = false,
}) => {
  const { colors, gradients } = useTheme();

  const avatarSize = SIZES[size];
  const statusSize = STATUS_SIZES[size];
  const fontVariant = FONT_SIZES[size];

  const initials = useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    ...(showBorder && {
      borderWidth: 2,
      borderColor: borderColor || themeColors.primary.purple,
    }),
    ...style,
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          contentFit="cover"
          transition={200}
        />
      );
    }

    return (
      <LinearGradient
        colors={gradients.warm as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.placeholder, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
      >
        <Text variant={fontVariant} style={styles.initials}>
          {initials}
        </Text>
      </LinearGradient>
    );
  };

  const renderStatus = () => {
    if (!showOnline) return null;
    return (
      <View
        style={[
          styles.statusContainer,
          {
            width: statusSize,
            height: statusSize,
            borderRadius: statusSize / 2,
            backgroundColor: isOnline ? themeColors.status.online : themeColors.status.offline,
            borderColor: colors.background,
          },
        ]}
      />
    );
  };

  const content = (
    <View style={containerStyle}>
      {renderContent()}
      {renderStatus()}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{ source?: string; name: string }>;
  max?: number;
  size?: AvatarSize;
  onPress?: () => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'small',
  onPress,
}) => {
  const { colors } = useTheme();
  const avatarSize = SIZES[size];
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const overlap = avatarSize * 0.3;

  const content = (
    <View style={styles.groupContainer}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            { marginLeft: index > 0 ? -overlap : 0, zIndex: displayAvatars.length - index },
          ]}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            showBorder
            borderColor={colors.background}
          />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.remainingContainer,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              marginLeft: -overlap,
              backgroundColor: colors.surface,
              borderColor: colors.background,
            },
          ]}
        >
          <Text variant="caption" color="secondary">
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {},
  remainingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});

export default Avatar;

