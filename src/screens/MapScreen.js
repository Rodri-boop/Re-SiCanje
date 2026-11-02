import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import useLocation from '../hooks/useLocation';
import { colors } from '../theme/colors';

// ---------------------------------------------------------
// DATOS DE LOS RESIDROPS (fuente: rama de Oliverio/Daniluk)
// ---------------------------------------------------------
export const DROPS = [
  {
    id: 'p1',
    nombre: 'ResiDrop Universidad (UNPilar)',
    dir: 'Universidad Nacional de Pilar, Buenos Aires',
    dist: 350,
    tipo: 'verde',
    acepta: 'Acepta: Botellas PET',
    materiales: 'PET 1',
    horario: 'Hasta las 22:00 hs',
    mult: '1,2×',
    desc: 'Punto de recepción en zona académica.',
    busquedaMaps: 'Universidad Nacional de Pilar',
  },
  {
    id: 'p2',
    nombre: 'ResiDrop Plaza Pilar',
    dir: 'Plaza 12 de Octubre, Pilar Centro',
    dist: 800,
    tipo: 'verde',
    acepta: 'Acepta: Botellas',
    materiales: 'PET 1, PEAD 2',
    horario: 'Abierto de 08 a 19 hs',
    mult: '1,0×',
    desc: 'Punto de recepción en el centro de Pilar.',
    busquedaMaps: 'Plaza 12 de Octubre Pilar',
  },
  {
    id: 'p3',
    nombre: 'ResiDrop Las Palmas',
    dir: 'Las Palmas del Pilar, Colectora Este',
    dist: 2500,
    tipo: 'super',
    acepta: 'Acepta: Envases PET',
    materiales: 'PET 1',
    horario: 'Abierto hasta las 22:00 hs',
    mult: '1,0×',
    desc: 'Punto de recepción en supermercado aliado.',
    busquedaMaps: 'Las Palmas del Pilar',
  },
  {
    id: 'p4',
    nombre: 'ResiDrop Estación Pilar',
    dir: 'Estación de Tren Pilar, Línea San Martín',
    dist: 1200,
    tipo: 'verde',
    acepta: 'Acepta: Plásticos PET',
    materiales: 'PET 1',
    horario: 'Hasta las 19:00 hs',
    mult: '1,2×',
    desc: 'Punto de recepción cerca de la estación.',
    busquedaMaps: 'Estacion de Tren Pilar',
  },
  {
    id: 'p5',
    nombre: 'ResiDrop Derqui',
    dir: 'Presidente Derqui Centro, Buenos Aires',
    dist: 4500,
    tipo: 'verde',
    acepta: 'Acepta: Plásticos PET',
    materiales: 'PET 1',
    horario: 'Hasta las 19:00 hs',
    mult: '1,0×',
    desc: 'Punto de recepción en Presidente Derqui.',
    busquedaMaps: 'Presidente Derqui Buenos Aires',
  },
  {
    id: 'p6',
    nombre: 'ResiDrop ChangoMás Pilar',
    dir: 'Colectora Panamericana, Pilar',
    dist: 3000,
    tipo: 'super',
    acepta: 'Acepta: Todo tipo de plásticos',
    materiales: 'PET 1, PEAD 2',
    horario: 'Abierto hasta las 22:00 hs',
    mult: '1,0×',
    desc: 'Punto de recepción en supermercado aliado.',
    busquedaMaps: 'Changomas Pilar Colectora Panamericana',
  },
];

const CHIPS = [
  { id: 'cercanos', label: 'Más cercanos' },
  { id: 'super', label: 'Supermercados' },
  { id: 'pet1', label: 'PET 1' },
];

const distancia = (m) => (m < 1000 ? `A ${m} m` : `A ${(m / 1000).toFixed(1).replace('.', ',')} km`);

// ---------------------------------------------------------
// PANTALLA
// ---------------------------------------------------------
export default function MapScreen({ navigate }) {
  const [busqueda, setBusqueda] = useState('');
  const [chip, setChip] = useState('cercanos');
  const { texto, cargando, actualizar } = useLocation();

  const lista = DROPS
    .filter((d) => (chip === 'super' ? d.tipo === 'super' : chip === 'pet1' ? d.materiales.includes('PET 1') : true))
    .filter((d) => `${d.nombre} ${d.dir}`.toLowerCase().includes(busqueda.trim().toLowerCase()))
    .sort((a, b) => a.dist - b.dist);

  // Abre Google Maps con la búsqueda del punto
  const abrirGoogleMaps = (busquedaMaps) => {
    const queryCodificada = encodeURIComponent(busquedaMaps);
    const url = Platform.select({
      ios: `maps:0,0?q=${queryCodificada}`,
      android: `geo:0,0?q=${queryCodificada}`,
      default: `https://www.google.com/maps/search/?api=1&query=${queryCodificada}`,
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${queryCodificada}`);
    });
  };

  const handleRecalcular = async () => {
    const res = await actualizar();
    Alert.alert('GPS Actualizado', res);
  };

  return (
    <Screen>
      <Header title="Resi-Drops cercanos" onBack={() => navigate('home')} onProfile={() => navigate('profile')} />

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

      {/* Tarjeta de ubicación GPS */}
      <Card style={s.gpsCard}>
        <View style={s.gpsHeader}>
          <Ionicons name="navigate-outline" size={18} color={colors.navy} />
          <Text style={s.gpsTitle}>Tu Ubicación Actual</Text>
        </View>
        <Text style={s.gpsSub}>{texto}</Text>
      </Card>

      <View style={s.mapa}>
        <Image source={require('../../assets/map.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={s.pin}><Ionicons name="location-outline" size={26} color={colors.white} /></View>
      </View>

      <Text style={s.section}>Puntos de canje disponibles</Text>
      {lista.map((d) => (
        <TouchableOpacity key={d.id} activeOpacity={0.85} onPress={() => abrirGoogleMaps(d.busquedaMaps)}>
          <Card style={s.drop}>
            <View style={[s.dropIcon, { backgroundColor: d.tipo === 'super' ? colors.blueSoft : colors.mint }]}>
              <Ionicons name={d.tipo === 'super' ? 'storefront-outline' : 'sync-outline'} size={28} color={d.tipo === 'super' ? colors.navy : colors.greenDark} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.nombreRow}>
                <Text style={s.dropNombre} numberOfLines={1}>{d.nombre}</Text>
                <Text style={s.mapLink}>Ver en Mapa ↗</Text>
              </View>
              <Text style={s.dropDir}>{d.dir}</Text>
              <Text style={s.dropHorario}>{d.horario}</Text>
              <Text style={s.dropInfo}>{distancia(d.dist)} • {d.acepta}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      {lista.length === 0 && <Text style={s.vacio}>No encontramos puntos con ese filtro.</Text>}

      <Button title="Actualizar mi ubicación GPS" onPress={handleRecalcular} loading={cargando} icon="locate-outline" />
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
  gpsCard: { backgroundColor: colors.blueSoft, borderColor: colors.blueSoft },
  gpsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  gpsTitle: { fontWeight: '800', color: colors.navy, fontSize: 14 },
  gpsSub: { color: colors.navy, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  mapa: { height: 180, marginHorizontal: -20, marginVertical: 8, alignItems: 'center', justifyContent: 'center' },
  pin: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 14, marginBottom: 12 },
  drop: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 16 },
  dropIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nombreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  dropNombre: { fontSize: 16, fontWeight: '800', color: colors.ink, flexShrink: 1 },
  mapLink: { fontSize: 12, fontWeight: '700', color: colors.navy },
  dropDir: { fontSize: 14, color: colors.slate, marginTop: 3 },
  dropHorario: { fontSize: 13, fontWeight: '700', color: colors.green, marginTop: 2 },
  dropInfo: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 4 },
  vacio: { textAlign: 'center', color: colors.slate, marginTop: 8 },
});
