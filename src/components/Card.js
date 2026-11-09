import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Card({ backgroundColor = colors.primary, label, value, sub, style }) {
  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});
