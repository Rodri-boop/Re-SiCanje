import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function LinkButton({ title, onPress, color = colors.primary, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[{ marginTop: 10 }, style]}>
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
