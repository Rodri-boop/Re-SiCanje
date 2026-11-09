import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function LinkButton({ title, onPress, color = colors.primary, align = 'center', style }) {
  const getAlignment = () => {
    if (align === 'right') return 'flex-end';
    if (align === 'left') return 'flex-start';
    return 'center';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { alignItems: getAlignment() }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
