/**
 * Screen 2: OTP Verification
 * Verify 6-digit OTP code sent to phone
 * Per UI_SCREENS.md lines 1125-1206
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCredentials } from '../../store/slices/authSlice';
import { API_ENDPOINTS } from '@/constants/api';
import { BackButton } from '@/components/ui/BackButton';
import { colors, typography, spacing } from '../../theme';

export const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { phoneNumber } = (route.params as any) || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && !loading) {
      handleVerifyOTP(otpString);
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');

    if (digit.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-advance to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpString: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otpString,
          device_id: 'mobile-app-' + Date.now(),
          device_type: Platform.OS,
          device_name: 'Mobile App',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in Redux
        dispatch(setCredentials({
          user: data.data.user,
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token,
        }));

        // Navigate based on is_new_user
        if (data.data.is_new_user) {
          (navigation.navigate as any)('ProfileSetup');
        } else {
          // Navigate to main app (will be handled by AppNavigator)
          (navigation.reset as any)({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      } else {
        // Show error and shake animation
        setError('Invalid OTP. Please try again.');
        shakeOTPBoxes();
        clearOTP();
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const shakeOTPBoxes = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const clearOTP = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      if (response.ok) {
        setResendTimer(30);
        setError('');
        // Show toast: OTP sent
      }
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 8) return phone;
    return `${phone.substring(0, 6)}-XXXXX`;
  };

  const handleBack = () => {
    Alert.alert(
      'Cancel Verification',
      "Are you sure? You'll need to request OTP again.",
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Go Back',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button - Top Left */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>Sent to {maskPhoneNumber(phoneNumber)}</Text>

        {/* OTP Input Boxes */}
        <Animated.View
          style={[styles.otpContainer, { transform: [{ translateX: shakeAnimation }] }]}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                digit && styles.otpBoxFilled,
                error && styles.otpBoxError,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </Animated.View>

        {/* Status/Error Message */}
        {loading && (
          <Text style={styles.statusText}>Auto-verifying...</Text>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code?</Text>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>Resend OTP (in {resendTimer}s)</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.textPrimary,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  otpBox: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: colors.divider,
    borderRadius: 8,
    backgroundColor: colors.cardBg,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 4,
  },
  otpBoxFilled: {
    borderColor: colors.primaryBlue,
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  statusText: {
    fontSize: typography.bodySmall.size,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: typography.bodySmall.size,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  resendText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resendTimer: {
    fontSize: 13,
    color: colors.textDisabled,
  },
  resendLink: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontWeight: '600',
  },
});
