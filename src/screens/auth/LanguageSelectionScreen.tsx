/**
 * Screen 0: Language Selection
 * First screen shown on app launch (onboarding)
 * Allows user to select preferred language from 11 Indian languages
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KhatabookLogo from '../../assets/images/logo.svg';
import { colors, typography, spacing } from '../../theme';

interface Language {
  code: string;
  nativeName: string;
  englishName: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
];

export const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const handleContinue = async () => {
    try {
      // Save language preference
      await AsyncStorage.setItem('language_code', selectedLanguage);

      // Navigate to Phone Login
      (navigation.navigate as any)('PhoneLogin');
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <KhatabookLogo width={200} height={120} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>अपनी भाषा चुनें</Text>

        {/* Language Grid */}
        <View style={styles.languageGrid}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage(language.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.languageNative}>{language.nativeName}</Text>
              <Text style={styles.languageEnglish}>{language.englishName}</Text>

              {selectedLanguage === language.code && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLanguage && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedLanguage}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  scrollContent: {
    padding: spacing.lg,
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
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xxxl,
  },
  languageCard: {
    width: '48%',
    height: 56,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.divider,
    padding: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'center',
    position: 'relative',
  },
  languageCardSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: '#E3F2FD', // Light blue tint
  },
  languageNative: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  continueButton: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  continueButtonDisabled: {
    backgroundColor: colors.divider,
  },
  continueButtonText: {
    fontSize: typography.button.size,
    fontWeight: typography.button.weight as any,
    color: '#FFFFFF',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
