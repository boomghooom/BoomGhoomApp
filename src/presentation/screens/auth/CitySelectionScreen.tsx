/**
 * City Selection Screen
 * Location permission & city selection for new users
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';

import { Text, Button, Input, Card, IconButton } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';

interface City {
  id: string;
  name: string;
  state: string;
  popular: boolean;
}

const CITIES: City[] = [
  { id: 'del', name: 'Delhi', state: 'Delhi NCR', popular: true },
  { id: 'mum', name: 'Mumbai', state: 'Maharashtra', popular: true },
  { id: 'blr', name: 'Bangalore', state: 'Karnataka', popular: true },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', popular: true },
  { id: 'che', name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { id: 'kol', name: 'Kolkata', state: 'West Bengal', popular: true },
  { id: 'pun', name: 'Pune', state: 'Maharashtra', popular: false },
  { id: 'ahd', name: 'Ahmedabad', state: 'Gujarat', popular: false },
  { id: 'jai', name: 'Jaipur', state: 'Rajasthan', popular: false },
  { id: 'lko', name: 'Lucknow', state: 'Uttar Pradesh', popular: false },
  { id: 'chn', name: 'Chandigarh', state: 'Punjab', popular: false },
  { id: 'goa', name: 'Goa', state: 'Goa', popular: false },
  { id: 'koc', name: 'Kochi', state: 'Kerala', popular: false },
  { id: 'ind', name: 'Indore', state: 'Madhya Pradesh', popular: false },
  { id: 'nag', name: 'Nagpur', state: 'Maharashtra', popular: false },
];

interface CitySelectionScreenProps {
  onCitySelected: (city: City) => void;
  onBack?: () => void;
}

const CityCard: React.FC<{
  city: City;
  selected: boolean;
  onSelect: () => void;
  index: number;
}> = ({ city, selected, onSelect, index }) => {
  const { colors, primary } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        style={[
          styles.cityCard,
          {
            backgroundColor: selected ? 'rgba(155, 109, 255, 0.15)' : colors.surface,
            borderColor: selected ? primary.purple : colors.border,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cityInfo}>
          <Text variant="bodyMedium" color={selected ? 'primary' : 'primary'}>
            {city.name}
          </Text>
          <Text variant="caption" color="tertiary">
            {city.state}
          </Text>
        </View>
        {selected && (
          <View style={[styles.checkmark, { backgroundColor: primary.purple }]}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
        )}
        {city.popular && !selected && (
          <View style={[styles.popularBadge, { backgroundColor: 'rgba(255, 138, 80, 0.15)' }]}>
            <Text variant="tiny" style={{ color: themeColors.primary.orange }}>
              POPULAR
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CitySelectionScreen: React.FC<CitySelectionScreenProps> = ({
  onCitySelected,
  onBack,
}) => {
  const { colors, primary } = useTheme();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleUseLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address?.city) {
        const detectedCity = CITIES.find(
          (c) => c.name.toLowerCase() === address.city?.toLowerCase()
        );

        if (detectedCity) {
          setSelectedCity(detectedCity);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Alert.alert(
            'City Not Supported',
            `We detected ${address.city}, but it's not in our supported cities yet. Please select from the list below.`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please select your city manually.',
        [{ text: 'OK' }]
      );
    }

    setIsLoadingLocation(false);
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES;
    const query = searchQuery.toLowerCase();
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.state.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const popularCities = useMemo(() => filteredCities.filter((c) => c.popular), [filteredCities]);
  const otherCities = useMemo(() => filteredCities.filter((c) => !c.popular), [filteredCities]);

  const handleContinue = useCallback(() => {
    if (selectedCity) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onCitySelected(selectedCity);
    }
  }, [selectedCity, onCitySelected]);

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />}
        <View style={styles.headerText}>
          <Text variant="h2">Select Your City</Text>
          <Text variant="body" color="secondary">
            Discover events happening around you
          </Text>
        </View>
      </View>

      {/* Location button */}
      <View style={styles.locationSection}>
        <TouchableOpacity
          style={[
            styles.locationButton,
            { backgroundColor: 'rgba(155, 109, 255, 0.1)', borderColor: primary.purple },
          ]}
          onPress={handleUseLocation}
          disabled={isLoadingLocation}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[themeColors.primary.purple, themeColors.primary.blue]}
            style={styles.locationIconContainer}
          >
            <Ionicons
              name={isLoadingLocation ? 'refresh' : 'locate'}
              size={20}
              color="#FFFFFF"
            />
          </LinearGradient>
          <View style={styles.locationText}>
            <Text variant="bodyMedium">
              {isLoadingLocation ? 'Detecting location...' : 'Use Current Location'}
            </Text>
            <Text variant="caption" color="secondary">
              We'll find events near you
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Cities list */}
      <ScrollView
        style={styles.citiesList}
        contentContainerStyle={styles.citiesContent}
        showsVerticalScrollIndicator={false}
      >
        {popularCities.length > 0 && (
          <>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              POPULAR CITIES
            </Text>
            <View style={styles.citiesGrid}>
              {popularCities.map((city, index) => (
                <CityCard
                  key={city.id}
                  city={city}
                  selected={selectedCity?.id === city.id}
                  onSelect={() => setSelectedCity(city)}
                  index={index}
                />
              ))}
            </View>
          </>
        )}

        {otherCities.length > 0 && (
          <>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              OTHER CITIES
            </Text>
            <View style={styles.citiesGrid}>
              {otherCities.map((city, index) => (
                <CityCard
                  key={city.id}
                  city={city}
                  selected={selectedCity?.id === city.id}
                  onSelect={() => setSelectedCity(city)}
                  index={index + popularCities.length}
                />
              ))}
            </View>
          </>
        )}

        {filteredCities.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text variant="body" color="tertiary" align="center" style={styles.emptyText}>
              No cities found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedCity}
          fullWidth
          icon="arrow-forward"
          iconPosition="right"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerText: {
    marginTop: spacing.md,
  },
  locationSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationText: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  citiesList: {
    flex: 1,
  },
  citiesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  citiesGrid: {
    gap: spacing.sm,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  cityInfo: {
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    marginTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: 40,
  },
});

export default CitySelectionScreen;

