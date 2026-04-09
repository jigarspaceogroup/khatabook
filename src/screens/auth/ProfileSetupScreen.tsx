/**
 * Screen 3: Profile Setup
 * Collect user name and business details on first login
 * Per UI_SCREENS.md lines 1209-1286
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateUser } from '../../store/slices/authSlice';
import { API_ENDPOINTS } from '@/constants/api';
import { BackButton } from '@/components/ui/BackButton';
import { colors, typography, spacing } from '../../theme';

const BUSINESS_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

export const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('retail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidName = name.trim().length >= 2;

  const handleContinue = async () => {
    if (!isValidName) {
      setError('Please enter your name (minimum 2 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          // businessName and businessType will be used in khatabook creation
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update Redux with new user info
        dispatch(updateUser(data.data));

        // Navigate to Create Khatabook screen
        (navigation.navigate as any)('CreateKhatabook', {
          businessName: businessName.trim() || null,
          businessType,
        });
      } else {
        setError(data.error?.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip profile setup, go directly to create khatabook
    (navigation.navigate as any)('CreateKhatabook', {
      businessName: null,
      businessType: 'retail',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Back Button - Top Left */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Icon Illustration */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>This helps personalize your app</Text>

          {/* Name Input (Required) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textDisabled}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              editable={!loading}
              autoFocus
            />
          </View>

          {/* Business Name Input (Optional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Sharma Kirana Store"
              placeholderTextColor={colors.textDisabled}
              value={businessName}
              onChangeText={setBusinessName}
              editable={!loading}
            />
          </View>

          {/* Business Type Dropdown (Simplified as buttons for now) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Type</Text>
            <View style={styles.businessTypeGrid}>
              {BUSINESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.businessTypeButton,
                    businessType === type.value && styles.businessTypeButtonSelected,
                  ]}
                  onPress={() => setBusinessType(type.value)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.businessTypeText,
                      businessType === type.value && styles.businessTypeTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.button, (!isValidName || loading) && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValidName || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity onPress={handleSkip} disabled={loading}>
            <Text style={styles.skipLink}>Skip for now →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h1.size,
    fontWeight: typography.h1.weight as any,
    color: colors.textPrimary,
    marginTop: 40,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.bodySmall.size,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 56,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.size,
    color: colors.textPrimary,
  },
  businessTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  businessTypeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  businessTypeButtonSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: '#E3F2FD',
  },
  businessTypeText: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  businessTypeTextSelected: {
    color: colors.primaryBlue,
    fontWeight: '600',
  },
  errorText: {
    fontSize: typography.bodySmall.size,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
  },
  buttonDisabled: {
    backgroundColor: colors.divider,
  },
  buttonText: {
    fontSize: typography.button.size,
    fontWeight: typography.button.weight as any,
    color: '#FFFFFF',
  },
  skipLink: {
    fontSize: typography.body.size,
    color: colors.primaryBlue,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 48,
  },
});
