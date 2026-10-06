import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const BG = { primary: colors.primary, green: colors.green, mp: colors.mp };

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const isGoogle = variant === 'google';
  return (
    <TouchableOpacity
      style={[styles.base, isGoogle ? styles.google : { backgroundColor: BG[variant] }, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, isGoogle && styles.googleText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  text: { color: colors.white, fontWeight: 'bold', fontSize: 15 },
  google: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#CBD5E1' },
  googleText: { color: '#1E293B' },
});
