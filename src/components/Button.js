import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const V = {
  primary: { bg: colors.navy, fg: colors.white },
  green: { bg: colors.green, fg: colors.white },
  mp: { bg: colors.mp, fg: colors.white },
  dark: { bg: colors.black, fg: colors.white },
  google: { bg: colors.google, fg: colors.white },
  outline: { bg: colors.white, fg: colors.navy, border: colors.navy },
  white: { bg: colors.white, fg: colors.ink, border: colors.border },
};

export default function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }) {
  const v = V[variant] || V.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[s.base, { backgroundColor: v.bg, borderColor: v.border || v.bg, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={v.fg} style={{ marginRight: 8 }} />}
          <Text style={[s.text, { color: v.fg }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: { width: '100%', minHeight: 52, borderRadius: 26, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginBottom: 10 },
  text: { fontSize: 16, fontWeight: '700' },
});