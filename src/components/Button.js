import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

export default function Button({ title, onPress, variant = 'primary', loading = false, style }) {
  const isGreen = variant === 'green';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isGreen ? styles.bgGreen : styles.bgPrimary,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  bgGreen: {
    backgroundColor: colors.green,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
