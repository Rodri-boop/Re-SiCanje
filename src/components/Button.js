import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const BG = { primary: colors.primary, green: colors.green, mp: colors.mp };

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const isGoogle = variant === 'google';
  const isMp = variant === 'mp';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isGoogle ? styles.google : { backgroundColor: BG[variant] || colors.primary },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isGoogle ? colors.dark : colors.white} />
      ) : (
        <Text style={[styles.text, isGoogle && styles.googleText, isMp && styles.mpText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  google: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    elevation: 0,
    shadowOpacity: 0,
  },
  googleText: {
    color: '#1E293B',
  },
  mpText: {
    color: colors.white,
  },
  disabled: {
    opacity: 0.6,
  },
});