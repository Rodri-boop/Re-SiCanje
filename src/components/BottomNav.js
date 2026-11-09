import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ITEMS = [
  { key: 'home', label: 'Inicio' },
  { key: 'scan', label: 'Tomar Fotos' },
  { key: 'map', label: 'ReciDrops' },
  { key: 'wallet', label: 'Billetera' },
];

export default function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {ITEMS.map(({ key, label }) => {
          const active = current === key;
          return (
            <TouchableOpacity 
              key={key} 
              style={[styles.item, active && styles.itemActive]} 
              onPress={() => onNavigate(key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.label, active && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  itemActive: {
    backgroundColor: '#F0FDF4',
  },
  label: {
    fontSize: 12,
    color: colors.slate400,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.green,
    fontWeight: '700',
  },
});
