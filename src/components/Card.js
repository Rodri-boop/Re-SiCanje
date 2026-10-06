import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Card({ label, value, sub, backgroundColor, valueColor = colors.white }) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 16, marginBottom: 12 },
  label: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  value: { fontSize: 26, fontWeight: '900', marginVertical: 4 },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
});
