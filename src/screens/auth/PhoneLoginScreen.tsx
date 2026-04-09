/**
 * Screen 1: Phone Login
 * Collect phone number and send OTP
 * Per UI_SCREENS.md lines 1044-1122
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '@/constants/api';
import { BackButton } from '@/components/ui/BackButton';
import KhatabookLogo from '../../assets/images/logo.svg';
import { colors, typography, spacing } from '../../theme';

export const PhoneLoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidPhone = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

  const handleGetOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+91${phoneNumber}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to OTP screen
        const nav = navigation as any;
        nav.navigate('OTPVerification', {
          phoneNumber: `+91${phoneNumber}`,
        });
      } else {
        setError(data.error?.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
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

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <KhatabookLogo width={200} height={120} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome to Khatabook</Text>
          <Text style={styles.subtitle}>Manage your business digitally</Text>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneInput}>
              <Text style={styles.phoneIcon}>📱</Text>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.textDisabled}
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/\D/g, ''));
                  setError('');
                }}
                editable={!loading}
                autoFocus
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Get OTP Button */}
          <TouchableOpacity
            style={[styles.button, (!isValidPhone || loading) && styles.buttonDisabled]}
            onPress={handleGetOTP}
            disabled={!isValidPhone || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Get OTP</Text>
            )}
          </TouchableOpacity>

          {/* Terms & Privacy */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms</Text> &{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 60,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.h1.size,
    fontWeight: typography.h1.weight as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginBottom: 48,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.lg,
  },
  countryCode: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.divider,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.body.size,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: typography.bodySmall.size,
    color: colors.error,
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.divider,
  },
  buttonText: {
    fontSize: typography.button.size,
    fontWeight: typography.button.weight as any,
    color: '#FFFFFF',
  },
  terms: {
    fontSize: typography.caption.size,
    color: colors.textSecondary,
    marginTop: spacing.xxl,
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    color: colors.primaryBlue,
    textDecorationLine: 'underline',
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});
