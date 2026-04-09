/**
 * Placeholder Auth Screen
 * Temporary screen showing authentication flow is under development
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';

export const PlaceholderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khatabook Clone</Text>
      <Text style={styles.subtitle}>Authentication</Text>
      <Text style={styles.message}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h1.size,
    fontWeight: typography.h1.weight,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
});
