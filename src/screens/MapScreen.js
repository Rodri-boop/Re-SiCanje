import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import useLocation from '../hooks/useLocation';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const PUNTOS = [
  { id: 'p1', nombre: '🟢 Punto Central', dist: 'A 250 metros • Abierto 24 hs', acepta: 'Acepta: Botellas PET, Tapitas y Latas' },
  { id: 'p2', nombre: '🟢 Estación Plaza Verde', dist: 'A 800 metros • Hasta las 20:00 hs', acepta: 'Acepta: Plásticos y Cartón' },
];

export default function MapScreen() {
  const { texto, cargando, actualizar } = useLocation();

  const handleRecalcular = async () => {
    const msg = await actualizar();
    Alert.alert('GPS', msg);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Puntos de Entrega</Text>

      <View style={styles.gps}>
        <Text style={styles.gpsTitle}>📍 Tu Ubicación GPS</Text>
        <Text style={styles.gpsSub}>{texto}</Text>
      </View>

      <Text style={styles.section}>Centros Habilitados:</Text>
      {PUNTOS.map((p) => (
        <View key={p.id} style={styles.drop}>
          <Text style={styles.dropName}>{p.nombre}</Text>
          <Text style={styles.dropDist}>{p.dist}</Text>
          <Text style={styles.dropInfo}>{p.acepta}</Text>
        </View>
      ))}

      <Button title="🎯 Recalcular mi ubicación" onPress={handleRecalcular} loading={cargando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 90 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.dark },
  gps: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 14, borderRadius: 12, marginVertical: 15 },
  gpsTitle: { fontWeight: 'bold', color: '#1E40AF', fontSize: 14 },
  gpsSub: { color: '#3B82F6', fontSize: 12, marginTop: 2 },
  section: { fontSize: 15, fontWeight: 'bold', color: colors.slate700, marginBottom: 10 },
  drop: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, padding: 14, borderRadius: 12, marginBottom: 10 },
  dropName: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
  dropDist: { fontSize: 12, color: colors.green, fontWeight: 'bold', marginVertical: 3 },
  dropInfo: { fontSize: 12, color: colors.slate500 },
});
