/**
 * Auth Navigator
 * Stack navigator for authentication flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AuthStackParamList } from './types';
import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { LanguageSelectionScreen } from '@/screens/auth/LanguageSelectionScreen';
import { PhoneLoginScreen } from '@/screens/auth/PhoneLoginScreen';
import { OTPVerificationScreen } from '@/screens/auth/OTPVerificationScreen';
import { ProfileSetupScreen } from '@/screens/auth/ProfileSetupScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F5F5F5' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};
