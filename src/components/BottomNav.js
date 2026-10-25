import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ITEMS = [
  { key: 'home', label: 'Inicio', icon: 'home' },
  { key: 'scan', label: 'Escaneá', icon: 'camera' },
  { key: 'map', label: 'Resi-Drops', icon: 'location' },
  { key: 'wallet', label: 'Billetera', icon: 'wallet' },
];

export default function BottomNav({ current, onNavigate }) {
  return (
    <View style={s.bar}>
      {ITEMS.map(({ key, label, icon }) => {
        const on = current === key;
        const color = on ? colors.navy : colors.slate;
        return (
          <TouchableOpacity key={key} style={s.item} onPress={() => onNavigate(key)}>
            <Ionicons name={on ? icon : `${icon}-outline`} size={24} color={color} />
            <Text style={[s.label, { color }, on && { fontWeight: '800' }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  item: { alignItems: 'center', justifyContent: 'center', minWidth: 70 },
  label: { fontSize: 12, marginTop: 3, fontWeight: '500' },
});