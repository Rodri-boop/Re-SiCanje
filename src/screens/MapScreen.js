import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import SettingsSection from '../components/SettingsSection';
import { colors } from '../theme/colors';

// TODO: reemplazar por una tabla de Supabase
export const DROPS = [
  { id: 'sn', nombre: 'Punto Verde San Nicolás', dir: 'Av. de Mayo 123, CABA, Argentina', dist: 350, tipo: 'verde', acepta: 'Acepta todos los plásticos', materiales: 'PET 1, PEAD 2', horario: '24 h', mult: '1,2×', desc: 'Punto de recepción, pesaje y registro de plásticos reciclables.' },
  { id: 're', nombre: 'Punto Verde Recoleta', dir: 'Av. Santa Fe 1.450, CABA, Argentina', dist: 1200, tipo: 'super', acepta: 'Solo PET 1 y PEAD 2', materiales: 'PET 1, PEAD 2', horario: '08 a 20 h', mult: '1,0×', desc: 'Punto de recepción en supermercado aliado.' },
];

const CHIPS = [
  { id: 'cercanos', label: 'Más cercanos' },
  { id: 'super', label: 'Supermercados' },
  { id: 'pet1', label: 'PET 1' },
];

const distancia = (m) => (m < 1000 ? `A ${m} m` : `A ${(m / 1000).toFixed(1).replace('.', ',')} km`);

export default function MapScreen({ navigate }) {
  const [busqueda, setBusqueda] = useState('');
  const [chip, setChip] = useState('cercanos');

  const lista = DROPS
    .filter((d) => (chip === 'super' ? d.tipo === 'super' : chip === 'pet1' ? d.materiales.includes('PET 1') : true))
    .filter((d) => `${d.nombre} ${d.dir}`.toLowerCase().includes(busqueda.trim().toLowerCase()))
    .sort((a, b) => a.dist - b.dist);

  return (
    <Screen>
      <Header title="Resi-Drops cercanos" onBack={() => navigate('home')} />

      <View style={s.search}>
        <Ionicons name="search" size={22} color={colors.slate} />
        <TextInput style={s.searchInput} placeholder="Barrio, localidad o provincia de Argentina..." placeholderTextColor={colors.slate} value={busqueda} onChangeText={setBusqueda} />
      </View>

      <View style={s.chips}>
        {CHIPS.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => setChip(c.id)} style={[s.chip, chip === c.id && s.chipOn]}>
            <Text style={[s.chipTxt, chip === c.id && { color: colors.white }]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SettingsSection />

      <View style={s.mapa}>
        <Image source={require('../../assets/map.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={s.pin}><Ionicons name="location-outline" size={26} color={colors.white} /></View>
      </View>

      <Text style={s.section}>Puntos de canje disponibles</Text>
      {lista.map((d) => (
        <TouchableOpacity key={d.id} activeOpacity={0.85} onPress={() => navigate('drop_detail', { drop: d })}>
          <Card style={s.drop}>
            <View style={[s.dropIcon, { backgroundColor: d.tipo === 'super' ? colors.blueSoft : colors.mint }]}>
              <Ionicons name={d.tipo === 'super' ? 'storefront-outline' : 'sync-outline'} size={28} color={d.tipo === 'super' ? colors.navy : colors.greenDark} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.nombreRow}>
                <Text style={s.dropNombre} numberOfLines={1}>{d.nombre}</Text>
                <Text style={s.abierto}>Abierto</Text>
              </View>
              <Text style={s.dropDir}>{d.dir}</Text>
              <Text style={s.dropInfo}>{distancia(d.dist)} • {d.acepta}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      {lista.length === 0 && <Text style={s.vacio}>No encontramos puntos con ese filtro.</Text>}
    </Screen>
  );
}

const s = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 16, height: 52, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, color: colors.ink },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipTxt: { fontSize: 14, fontWeight: '700', color: colors.slate },
  mapa: { height: 180, marginHorizontal: -20, marginVertical: 8, alignItems: 'center', justifyContent: 'center' },
  pin: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 14, marginBottom: 12 },
  drop: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 16 },
  dropIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nombreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  dropNombre: { fontSize: 16, fontWeight: '800', color: colors.ink, flexShrink: 1 },
  abierto: { fontSize: 13, fontWeight: '700', color: colors.green },
  dropDir: { fontSize: 14, color: colors.slate, marginTop: 3 },
  dropInfo: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 4 },
  vacio: { textAlign: 'center', color: colors.slate, marginTop: 8 },
});