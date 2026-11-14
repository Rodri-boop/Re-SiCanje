import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function LinkButton({ title, onPress, color = colors.primary, align = 'center', style }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, { alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }, style]}
      activeOpacity={0.6}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});