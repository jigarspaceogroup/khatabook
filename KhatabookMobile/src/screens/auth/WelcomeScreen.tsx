/**
 * Welcome Screen
 * Animated splash/welcome screen shown on app launch
 * Shows logo with animation, then navigates to Language Selection
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import KhatabookLogo from '../../assets/images/logo.svg';
import { colors } from '@/theme';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Language Selection after 2.5 seconds
    // Use reset to prevent going back to Welcome screen
    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LanguageSelection' as never }],
        })
      );
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#2C60E4', '#1E4DB7', '#153A8C']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <KhatabookLogo width={250} height={150} />
      </Animated.View>

      {/* Optional: Add animated text */}
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Manage your business digitally
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    position: 'absolute',
    bottom: 80,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
