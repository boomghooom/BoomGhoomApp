/**
 * KYC Selfie Screen
 * Camera interface for selfie capture
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Button, IconButton } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

const { width, height } = Dimensions.get('window');
const FRAME_SIZE = width * 0.75;

interface KYCSelfieScreenProps {
  onCapture: (imageUri: string) => void;
  onBack: () => void;
}

export const KYCSelfieScreen: React.FC<KYCSelfieScreenProps> = ({
  onCapture,
  onBack,
}) => {
  const { colors, primary } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const flashOpacity = useSharedValue(0);
  const frameScale = useSharedValue(1);

  const handleCapture = useCallback(async () => {
    if (isCapturing || !cameraRef.current) return;

    setIsCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate frame
    frameScale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );

    // Flash effect
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }

    setIsCapturing(false);
  }, [isCapturing, onCapture, frameScale, flashOpacity]);

  const toggleFacing = useCallback(() => {
    setFacing((current) => (current === 'front' ? 'back' : 'front'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const frameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: frameScale.value }],
  }));

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text variant="body" color="secondary" align="center">
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
          </View>
          <Text variant="h3" align="center" style={styles.permissionTitle}>
            Camera Access Required
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.permissionText}>
            We need camera access to take your verification selfie
          </Text>
          <Button
            label="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          <Button
            label="Go Back"
            variant="ghost"
            onPress={onBack}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Flash overlay */}
        <Animated.View style={[styles.flashOverlay, flashAnimatedStyle]} />

        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-back" variant="blur" onPress={onBack} />
          <IconButton icon="camera-reverse-outline" variant="blur" onPress={toggleFacing} />
        </View>

        {/* Face frame */}
        <View style={styles.frameContainer}>
          <Animated.View style={[styles.frame, frameAnimatedStyle]}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </Animated.View>
          <Text variant="bodyMedium" style={styles.frameHint}>
            Position your face within the frame
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Ionicons name="sunny-outline" size={20} color="#FFFFFF" />
            <Text variant="bodySmall" style={styles.instructionText}>
              Good lighting
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="glasses-outline" size={20} color="#FFFFFF" />
            <Text variant="bodySmall" style={styles.instructionText}>
              Remove glasses
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="happy-outline" size={20} color="#FFFFFF" />
            <Text variant="bodySmall" style={styles.instructionText}>
              Look straight
            </Text>
          </View>
        </View>

        {/* Capture button */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isCapturing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[themeColors.primary.orange, themeColors.primary.magenta]}
              style={styles.captureButtonInner}
            >
              <View style={styles.captureButtonCenter} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    pointerEvents: 'none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  permissionIcon: {
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    marginBottom: spacing.sm,
  },
  permissionText: {
    marginBottom: spacing.xl,
  },
  permissionButton: {
    marginBottom: spacing.md,
    minWidth: 200,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE * 1.2,
    borderRadius: FRAME_SIZE * 0.6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: themeColors.primary.purple,
    borderWidth: 3,
  },
  cornerTL: {
    top: -3,
    left: FRAME_SIZE * 0.15,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    top: -3,
    right: FRAME_SIZE * 0.15,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    bottom: -3,
    left: FRAME_SIZE * 0.15,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    bottom: -3,
    right: FRAME_SIZE * 0.15,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 20,
  },
  frameHint: {
    color: '#FFFFFF',
    marginTop: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  instructionItem: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  instructionText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  captureContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
});

export default KYCSelfieScreen;

