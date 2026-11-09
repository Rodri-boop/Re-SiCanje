import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import useLocation from '../hooks/useLocation';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const RECIDROPS_LISTA = [
  { 
    id: 'p1', 
    nombre: 'ReciDrop Universidad (UNPilar)', 
    direccion: 'Universidad Nacional de Pilar, Buenos Aires', 
    distTexto: 'Zona Académica', 
    acepta: 'Acepta: Papel, Cartón y Botellas PET', 
    horario: 'Hasta las 21:00 hs',
    busquedaMaps: 'Universidad Nacional de Pilar'
  },
  { 
    id: 'p2', 
    nombre: 'ReciDrop Plaza Pilar', 
    direccion: 'Plaza 12 de Octubre, Pilar Centro', 
    distTexto: 'Centro', 
    acepta: 'Acepta: Botellas PET, Tapitas y Latas', 
    horario: 'Abierto 24 hs',
    busquedaMaps: 'Plaza 12 de Octubre Pilar'
  },
  { 
    id: 'p3', 
    nombre: 'ReciDrop Las Palmas', 
    direccion: 'Las Palmas del Pilar, Colectora Este', 
    distTexto: 'Km 50', 
    acepta: 'Acepta: Envases PET y Aluminio', 
    horario: 'Abierto 24 hs',
    busquedaMaps: 'Las Palmas del Pilar'
  },
  { 
    id: 'p4', 
    nombre: 'ReciDrop Estación Pilar', 
    direccion: 'Estación de Tren Pilar, Línea San Martín', 
    distTexto: 'Zona Estación', 
    acepta: 'Acepta: Plásticos, Cartón y Vidrio', 
    horario: 'Hasta las 20:00 hs',
    busquedaMaps: 'Estacion de Tren Pilar'
  },
  { 
    id: 'p5', 
    nombre: 'ReciDrop Derqui', 
    direccion: 'Presidente Derqui Centro, Buenos Aires', 
    distTexto: 'Derqui', 
    acepta: 'Acepta: Vidrio, Cartón y PET', 
    horario: 'Hasta las 19:00 hs',
    busquedaMaps: 'Presidente Derqui Buenos Aires'
  },
  { 
    id: 'p6', 
    nombre: 'ReciDrop ChangoMás Pilar', 
    direccion: 'Colectora Panamericana, Pilar', 
    distTexto: 'Colectora', 
    acepta: 'Acepta: Todo tipo de plásticos y latas', 
    horario: 'Abierto 24 hs',
    busquedaMaps: 'Changomas Pilar Colectora Panamericana'
  },
];

export default function MapScreen() {
  const { texto, cargando, actualizar } = useLocation();

  const handleRecalcular = async () => {
    const res = await actualizar();
    Alert.alert('GPS Actualizado', res.message);
  };

  const abrirGoogleMaps = (busqueda) => {
    const queryCodificada = encodeURIComponent(busqueda);
    const url = Platform.select({
      ios: `maps:0,0?q=${queryCodificada}`,
      android: `geo:0,0?q=${queryCodificada}`,
      default: `https://www.google.com/maps/search/?api=1&query=${queryCodificada}`
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${queryCodificada}`);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>ReciDrops Cercanos</Text>
      <Text style={styles.subtitle}>Toca cualquier ReciDrop para abrir su ubicación exacta en Google Maps.</Text>

      <View style={styles.gpsCard}>
        <View style={styles.gpsHeader}>
          <Text style={styles.gpsTitle}>Tu Ubicación Actual</Text>
        </View>
        <Text style={styles.gpsSub}>{texto}</Text>
      </View>

      <Text style={styles.section}>Red de ReciDrops Habilitados:</Text>
      
      {RECIDROPS_LISTA.map((p) => (
        <TouchableOpacity 
          key={p.id} 
          style={styles.dropCard}
          onPress={() => abrirGoogleMaps(p.busquedaMaps)}
          activeOpacity={0.8}
        >
          <View style={styles.dropHeaderRow}>
            <Text style={styles.dropName}>{p.nombre}</Text>
            <Text style={styles.mapLinkText}>Ver en Mapa ↗</Text>
          </View>
          <Text style={styles.dropAddress}>{p.direccion}</Text>
          <Text style={styles.dropDist}>{p.horario}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.dropInfo}>{p.acepta}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ marginTop: 10 }}>
        <Button title="Actualizar mi ubicación GPS" onPress={handleRecalcular} loading={cargando} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 24, fontWeight: '900', color: colors.dark },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 2, marginBottom: 16 },
  gpsCard: { 
    backgroundColor: '#EFF6FF', 
    borderWidth: 1, 
    borderColor: '#BFDBFE', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gpsHeader: { marginBottom: 4 },
  gpsTitle: { fontWeight: 'bold', color: '#1E40AF', fontSize: 14 },
  gpsSub: { color: '#3B82F6', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  section: { fontSize: 16, fontWeight: 'bold', color: colors.slate700, marginBottom: 12 },
  dropCard: { 
    backgroundColor: colors.white, 
    borderWidth: 1, 
    borderColor: colors.border, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dropHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropName: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
  mapLinkText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  dropAddress: { fontSize: 12, color: colors.slate500, marginTop: 1 },
  dropDist: { fontSize: 12, color: colors.green, fontWeight: '700', marginVertical: 4 },
  badgeContainer: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropInfo: { fontSize: 11, color: colors.slate600, fontWeight: '500' },
});
