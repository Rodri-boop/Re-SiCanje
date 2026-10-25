import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const V = {
  navy: { bg: colors.navy, fg: colors.white },
  green: { bg: colors.green, fg: colors.white },
  mint: { bg: colors.mint, fg: colors.greenDark },
  mintLine: { bg: colors.mint, fg: colors.greenDark, border: colors.green },
  soft: { bg: colors.blueSoft, fg: colors.navy },
  ghost: { bg: colors.soft, fg: colors.slate },
};

export default function Badge({ label, variant = 'navy', style }) {
  const v = V[variant];
  return (
    <View style={[s.badge, { backgroundColor: v.bg, borderColor: v.border || v.bg }, style]}>
      <Text style={[s.text, { color: v.fg }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  text: { fontSize: 12, fontWeight: '700' },
});