/**
 * Settings Screen
 * App settings, account management, and logout
 * Per UI_SCREENS.md Screen 15 (lines 2955-3120)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearCredentials } from '@/store/slices/authSlice';
import { API_ENDPOINTS } from '@/constants/api';
import { colors, typography, spacing } from '@/theme';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call logout API
              await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  device_id: 'mobile-app',
                  logout_all_devices: false,
                }),
              });
            } catch (error) {
              console.error('Logout API error:', error);
            } finally {
              // Clear local auth state regardless of API success
              dispatch(clearCredentials());
              // Navigation will auto-redirect to auth flow
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.section}>
          {/* Profile Row */}
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profilePhone}>{user?.phone_number}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          {/* Language Row */}
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.rowLabel}>Language</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>English</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.section}>
          <View style={styles.settingsRow}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>

          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.rowLabel}>Terms & Privacy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.rowLabel}>Help & Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  section: {
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.lg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: typography.bodySmall.size,
    color: colors.textSecondary,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    fontSize: typography.body.size,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxxl,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: typography.button.size,
    fontWeight: typography.button.weight as any,
    color: colors.error,
  },
});
