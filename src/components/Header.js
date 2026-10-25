import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function Avatar({ size = 32 }) {
  return <Image source={require('../../assets/logo.png')} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}

export default function Header({ title, onBack }) {
  return (
    <View style={s.row}>
      {onBack && (
        <TouchableOpacity style={s.back} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={colors.navy} />
        </TouchableOpacity>
      )}
      <Text style={s.title} numberOfLines={1}>{title}</Text>
      <Avatar />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(15,60,138,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: colors.ink },
});