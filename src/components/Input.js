import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Input({ label, style, ...props }) {
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput placeholderTextColor={colors.slate400} style={[styles.input, style]} {...props} />
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: 'bold', color: colors.slate700, marginBottom: 6 },
  input: {
    width: '100%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 12, fontSize: 14, color: colors.dark, marginBottom: 10,
  },
});
