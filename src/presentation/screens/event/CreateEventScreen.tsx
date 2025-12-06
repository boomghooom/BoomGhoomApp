/**
 * Create Event Screen
 * Step-by-step event creation flow
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';

import { Text, Input, Button, IconButton, Card, Badge } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { EventCategory, getEventCategoryIcon, getEventCategoryLabel, Gender } from '@domain/entities';

const CATEGORIES: EventCategory[] = [
  'sports', 'music', 'food', 'travel', 'games', 'movies',
  'art', 'tech', 'fitness', 'nightlife', 'outdoor', 'learning', 'networking', 'other',
];

interface CreateEventScreenProps {
  onBack: () => void;
  onCreate: (eventData: CreateEventFormData) => void;
}

interface CreateEventFormData {
  title: string;
  description: string;
  category: EventCategory;
  venueName: string;
  address: string;
  city: string;
  startDate: string;
  startTime: string;
  endTime: string;
  memberLimit: number;
  genderAllowed: Gender[];
  minAge: number;
  maxAge: number;
  requiresApproval: boolean;
  rules: string[];
  images: string[];
}

const CategoryPill: React.FC<{
  category: EventCategory;
  selected: boolean;
  onSelect: () => void;
}> = ({ category, selected, onSelect }) => {
  const { colors, primary } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        {
          backgroundColor: selected ? primary.purple : colors.surface,
          borderColor: selected ? primary.purple : colors.border,
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
      }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getEventCategoryIcon(category) as keyof typeof Ionicons.glyphMap}
        size={18}
        color={selected ? '#FFFFFF' : colors.textSecondary}
      />
      <Text
        variant="bodySmall"
        style={{ color: selected ? '#FFFFFF' : colors.textSecondary, marginLeft: 6 }}
      >
        {getEventCategoryLabel(category)}
      </Text>
    </TouchableOpacity>
  );
};

const GenderChip: React.FC<{
  gender: Gender;
  label: string;
  selected: boolean;
  onToggle: () => void;
}> = ({ gender, label, selected, onToggle }) => {
  const { colors, primary } = useTheme();
  const genderColor = gender === 'male' ? themeColors.gender.male : 
                     gender === 'female' ? themeColors.gender.female : primary.purple;

  return (
    <TouchableOpacity
      style={[
        styles.genderChip,
        {
          backgroundColor: selected ? `${genderColor}20` : colors.surface,
          borderColor: selected ? genderColor : colors.border,
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.genderCheckbox, { borderColor: genderColor }]}>
        {selected && (
          <View style={[styles.genderCheckboxInner, { backgroundColor: genderColor }]} />
        )}
      </View>
      <Text variant="bodySmall" style={{ color: selected ? genderColor : colors.textSecondary }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({
  onBack,
  onCreate,
}) => {
  const { colors, primary, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: '',
    description: '',
    category: 'sports',
    venueName: '',
    address: '',
    city: 'Mumbai',
    startDate: '',
    startTime: '',
    endTime: '',
    memberLimit: 20,
    genderAllowed: ['male', 'female', 'other'],
    minAge: 18,
    maxAge: 60,
    requiresApproval: true,
    rules: [],
    images: [],
  });
  const [newRule, setNewRule] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ['Basic Info', 'Location & Time', 'Rules & Settings', 'Preview'];

  const updateField = useCallback((field: keyof CreateEventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - formData.images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      updateField('images', [...formData.images, ...newImages].slice(0, 5));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [formData.images, updateField]);

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateField('images', newImages);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [formData.images, updateField]);

  const handleAddRule = useCallback(() => {
    if (newRule.trim()) {
      updateField('rules', [...formData.rules, newRule.trim()]);
      setNewRule('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [newRule, formData.rules, updateField]);

  const handleRemoveRule = useCallback((index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    updateField('rules', newRules);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [formData.rules, updateField]);

  const toggleGender = useCallback((gender: Gender) => {
    const current = formData.genderAllowed;
    if (current.includes(gender)) {
      if (current.length > 1) {
        updateField('genderAllowed', current.filter((g) => g !== gender));
      }
    } else {
      updateField('genderAllowed', [...current, gender]);
    }
  }, [formData.genderAllowed, updateField]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      onBack();
    }
  }, [currentStep, onBack]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onCreate(formData);
    }, 2000);
  }, [formData, onCreate]);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor:
                    index <= currentStep ? primary.purple : colors.surface,
                  borderColor:
                    index <= currentStep ? primary.purple : colors.border,
                },
              ]}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : (
                <Text
                  variant="caption"
                  style={{ color: index === currentStep ? '#FFFFFF' : colors.textTertiary }}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              variant="caption"
              color={index <= currentStep ? 'primary' : 'tertiary'}
              style={styles.stepLabel}
            >
              {step}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                { backgroundColor: index < currentStep ? primary.purple : colors.border },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderBasicInfoStep = () => (
    <View style={styles.stepContent}>
      <Text variant="h3" style={styles.stepTitle}>
        What's your event about?
      </Text>

      {/* Images */}
      <View style={styles.imagesSection}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          EVENT PHOTOS (Max 5)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesRow}>
            {formData.images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.imagePreview} contentFit="cover" />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {formData.images.length < 5 && (
              <TouchableOpacity
                style={[styles.addImageButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleAddImage}
              >
                <Ionicons name="camera-outline" size={24} color={colors.textSecondary} />
                <Text variant="caption" color="tertiary">
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          CATEGORY
        </Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category}
              category={category}
              selected={formData.category === category}
              onSelect={() => updateField('category', category)}
            />
          ))}
        </View>
      </View>

      <Input
        label="EVENT TITLE"
        placeholder="Give your event a catchy title"
        value={formData.title}
        onChangeText={(value) => updateField('title', value)}
      />

      <Input
        label="DESCRIPTION"
        placeholder="Tell people what your event is about..."
        value={formData.description}
        onChangeText={(value) => updateField('description', value)}
        multiline
        numberOfLines={4}
        inputStyle={{ height: 100, textAlignVertical: 'top' }}
      />
    </View>
  );

  const renderLocationTimeStep = () => (
    <View style={styles.stepContent}>
      <Text variant="h3" style={styles.stepTitle}>
        When & Where?
      </Text>

      <Input
        label="VENUE NAME"
        placeholder="e.g., Central Park Stadium"
        value={formData.venueName}
        onChangeText={(value) => updateField('venueName', value)}
        leftIcon="business-outline"
      />

      <Input
        label="ADDRESS"
        placeholder="Full address"
        value={formData.address}
        onChangeText={(value) => updateField('address', value)}
        leftIcon="location-outline"
      />

      <Input
        label="DATE"
        placeholder="Select date"
        value={formData.startDate}
        onChangeText={(value) => updateField('startDate', value)}
        leftIcon="calendar-outline"
      />

      <View style={styles.timeRow}>
        <View style={styles.timeInput}>
          <Input
            label="START TIME"
            placeholder="e.g., 10:00 AM"
            value={formData.startTime}
            onChangeText={(value) => updateField('startTime', value)}
            leftIcon="time-outline"
          />
        </View>
        <View style={styles.timeInput}>
          <Input
            label="END TIME"
            placeholder="e.g., 1:00 PM"
            value={formData.endTime}
            onChangeText={(value) => updateField('endTime', value)}
            leftIcon="time-outline"
          />
        </View>
      </View>
    </View>
  );

  const renderRulesSettingsStep = () => (
    <View style={styles.stepContent}>
      <Text variant="h3" style={styles.stepTitle}>
        Settings & Rules
      </Text>

      {/* Member limit */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          MEMBER LIMIT
        </Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: colors.surface }]}
            onPress={() => updateField('memberLimit', Math.max(2, formData.memberLimit - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text variant="h3" style={styles.counterValue}>
            {formData.memberLimit}
          </Text>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: colors.surface }]}
            onPress={() => updateField('memberLimit', Math.min(100, formData.memberLimit + 1))}
          >
            <Ionicons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gender allowed */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          ALLOWED GENDERS
        </Text>
        <View style={styles.genderRow}>
          <GenderChip
            gender="male"
            label="Male"
            selected={formData.genderAllowed.includes('male')}
            onToggle={() => toggleGender('male')}
          />
          <GenderChip
            gender="female"
            label="Female"
            selected={formData.genderAllowed.includes('female')}
            onToggle={() => toggleGender('female')}
          />
          <GenderChip
            gender="other"
            label="Other"
            selected={formData.genderAllowed.includes('other')}
            onToggle={() => toggleGender('other')}
          />
        </View>
      </View>

      {/* Age range */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          AGE RANGE
        </Text>
        <View style={styles.ageRow}>
          <View style={styles.ageInput}>
            <Input
              label="MIN AGE"
              value={formData.minAge.toString()}
              onChangeText={(value) => updateField('minAge', parseInt(value) || 18)}
              keyboardType="number-pad"
            />
          </View>
          <Text variant="body" color="secondary" style={styles.ageSeparator}>
            to
          </Text>
          <View style={styles.ageInput}>
            <Input
              label="MAX AGE"
              value={formData.maxAge.toString()}
              onChangeText={(value) => updateField('maxAge', parseInt(value) || 60)}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      {/* Approval required */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.toggleRow, { backgroundColor: colors.surface }]}
          onPress={() => updateField('requiresApproval', !formData.requiresApproval)}
        >
          <View style={styles.toggleContent}>
            <Text variant="bodyMedium">Require Approval</Text>
            <Text variant="caption" color="secondary">
              Review join requests before accepting
            </Text>
          </View>
          <View
            style={[
              styles.toggleSwitch,
              {
                backgroundColor: formData.requiresApproval
                  ? primary.purple
                  : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                {
                  transform: [
                    { translateX: formData.requiresApproval ? 16 : 0 },
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Rules */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          EVENT RULES
        </Text>
        <View style={styles.addRuleRow}>
          <Input
            placeholder="Add a rule..."
            value={newRule}
            onChangeText={setNewRule}
            containerStyle={styles.ruleInput}
          />
          <Button
            label="Add"
            variant="secondary"
            size="small"
            onPress={handleAddRule}
            disabled={!newRule.trim()}
          />
        </View>
        {formData.rules.map((rule, index) => (
          <View key={index} style={[styles.ruleItem, { backgroundColor: colors.surface }]}>
            <Text variant="bodySmall" style={styles.ruleText}>
              {index + 1}. {rule}
            </Text>
            <TouchableOpacity onPress={() => handleRemoveRule(index)}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPreviewStep = () => (
    <View style={styles.stepContent}>
      <Text variant="h3" style={styles.stepTitle}>
        Review Your Event
      </Text>

      <Card variant="gradient" style={styles.previewCard}>
        {formData.images[0] && (
          <Image
            source={{ uri: formData.images[0] }}
            style={styles.previewImage}
            contentFit="cover"
          />
        )}
        <View style={styles.previewContent}>
          <Badge
            label={getEventCategoryLabel(formData.category)}
            variant="outlined"
            size="small"
          />
          <Text variant="h3" style={styles.previewTitle}>
            {formData.title || 'Event Title'}
          </Text>
          <View style={styles.previewInfo}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text variant="bodySmall" color="secondary">
              {formData.venueName || 'Venue'}, {formData.city}
            </Text>
          </View>
          <View style={styles.previewInfo}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text variant="bodySmall" color="secondary">
              {formData.memberLimit} max participants
            </Text>
          </View>
        </View>
      </Card>

      <Text variant="body" color="secondary" style={styles.previewNote}>
        By creating this event, you agree to our community guidelines. You'll earn
        80% commission from all dues collected when the event is successfully completed.
      </Text>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        return renderLocationTimeStep();
      case 2:
        return renderRulesSettingsStep();
      case 3:
        return renderPreviewStep();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="arrow-back" variant="ghost" onPress={handlePrevious} />
        <Text variant="h4">Create Event</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label={currentStep === steps.length - 1 ? 'Create Event' : 'Continue'}
          onPress={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          loading={isSubmitting}
          fullWidth
          icon={currentStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
          iconPosition="right"
        />
      </View>
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 10,
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepContent: {},
  stepTitle: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  imagesSection: {
    marginBottom: spacing.lg,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    minWidth: 60,
    textAlign: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  genderCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderCheckboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageInput: {
    flex: 1,
  },
  ageSeparator: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  toggleContent: {
    flex: 1,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  addRuleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  ruleInput: {
    flex: 1,
    marginBottom: 0,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  ruleText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  previewCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 160,
  },
  previewContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  previewTitle: {
    marginTop: spacing.xs,
  },
  previewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  previewNote: {
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});

export default CreateEventScreen;

