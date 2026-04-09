/**
 * Stylish Back Button Component
 * Reusable back button with custom icon (no background)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Image
        source={require('../../assets/images/back-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#212121',
  },
});
