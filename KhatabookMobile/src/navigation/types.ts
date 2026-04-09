/**
 * Navigation type definitions for React Navigation
 */

import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Auth Stack Navigator
export type AuthStackParamList = {
  LanguageSelection: undefined;
  PhoneLogin: undefined;
  OTPVerification: { phoneNumber: string };
  ProfileSetup: undefined;
};

export type AuthStackNavigationProp =
  StackNavigationProp<AuthStackParamList>;

// Main Bottom Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Customers: undefined;
  Reports: undefined;
  Settings: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Root Navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
