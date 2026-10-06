import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ITEMS = [
  { key: 'home', icon: '🏠', label: 'Inicio' },
  { key: 'scan', icon: '📷', label: 'Escanear' },
  { key: 'map', icon: '📍', label: 'Puntos' },
  { key: 'wallet', icon: '💳', label: 'Billetera' },
];

export default function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.bar}>
      {ITEMS.map(({ key, icon, label }) => {
        const active = current === key;
        return (
          <TouchableOpacity key={key} style={styles.item} onPress={() => onNavigate(key)}>
            <Text style={[styles.icon, { color: active ? colors.primary : colors.slate400 }]}>{icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row',
    justifyContent: 'space-around', alignItems: 'center',
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  label: { fontSize: 11, color: colors.slate400, marginTop: 2 },
  labelActive: { fontWeight: 'bold', color: colors.primary },
});
