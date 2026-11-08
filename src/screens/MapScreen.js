import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import useLocation from '../hooks/useLocation';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

const PUNTOS = [
  {
    id: 'p1',
    nombre: 'Reci-Drop Central Luján',
    direccion: 'Av. Humberto 1° 850',
    dist: 'A 250 metros',
    horario: 'Abierto 24 hs',
    isOpen: true,
    materiales: ['Botellas PET', 'Tapitas', 'Latas'],
    materialKeys: ['pet', 'tapitas', 'latas'],
    puntosPorEntrega: '+50 PTS/botella',
  },
  {
    id: 'p2',
    nombre: 'Estación Plaza Verde',
    direccion: 'Plaza Belgrano (Sector Reciclaje)',
    dist: 'A 800 metros',
    horario: 'Hoy hasta las 20:00 hs',
    isOpen: true,
    materiales: ['Botellas PET', 'Plásticos PEAD', 'Cartón'],
    materialKeys: ['pet', 'pead', 'carton'],
    puntosPorEntrega: '+50 PTS/botella',
  },
  {
    id: 'p3',
    nombre: 'EcoUsina Nodo Sustentable',
    direccion: 'Ruta 5 Km 68, Parque Industrial',
    dist: 'A 1.8 Km',
    horario: 'Hoy hasta las 18:00 hs',
    isOpen: false,
    materiales: ['Gran volumen PET', 'Envases plásticos', 'Aluminio'],
    materialKeys: ['pet', 'pead', 'latas'],
    puntosPorEntrega: '+60 PTS/Kg',
  },
];

export default function MapScreen() {
  const { texto, cargando, actualizar } = useLocation();
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const handleRecalcular = async () => {
    const msg = await actualizar();
    Alert.alert('GPS Actualizado', msg);
  };

  const handleRuta = (nombre, direccion) => {
    Alert.alert(
      'Cómo llegar',
      `Calculando la ruta más corta hacia:\n📍 ${nombre}\n${direccion}\n\n¡Tiempo estimado de caminata: 4 minutos!`
    );
  };

  const filteredPuntos = PUNTOS.filter((p) => {
    if (selectedFilter === 'todos') return true;
    return p.materialKeys.includes(selectedFilter);
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Puntos Reci-Drops</Text>
          <Text style={styles.subtitle}>Centros y contenedores verdes habilitados</Text>
        </View>
        <View style={styles.iconBadgeTop}>
          <Icon name="map" size={20} color={colors.primary} />
        </View>
      </View>

      {/* Tarjeta de Radar / GPS */}
      <View style={styles.gpsCard}>
        <View style={styles.gpsTopRow}>
          <View style={styles.gpsTitleRow}>
            <View style={styles.gpsDot} />
            <Text style={styles.gpsTitle}>TU UBICACIÓN ACTIVA</Text>
          </View>
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>GPS Alta Precisión</Text>
          </View>
        </View>

        <Text style={styles.gpsCoordText}>{texto}</Text>

        <TouchableOpacity
          style={styles.recalcBtn}
          activeOpacity={0.8}
          onPress={handleRecalcular}
          disabled={cargando}
        >
          <Icon
            name="refresh"
            size={14}
            color={colors.primaryDark}
            style={cargando ? styles.rotating : undefined}
          />
          <Text style={styles.recalcText}>
            {cargando ? 'Actualizando GPS...' : 'Recalcular mi posición'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros por Material */}
      <Text style={styles.sectionHeader}>FILTRAR POR MATERIAL</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {[
          ['todos', 'Todos los centros'],
          ['pet', '♳ Botellas PET'],
          ['tapitas', 'Tapitas'],
          ['latas', 'Latas'],
          ['pead', '♴ Envases PEAD'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterChip,
              selectedFilter === key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === key && styles.filterChipTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Puntos Reci-Drops */}
      <View style={styles.listSection}>
        <Text style={styles.sectionHeader}>
          CENTROS DISPONIBLES ({filteredPuntos.length})
        </Text>

        {filteredPuntos.map((p) => (
          <View key={p.id} style={styles.dropCard}>
            <View style={styles.dropTop}>
              <View style={styles.dropInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.dropName}>{p.nombre}</Text>
                </View>
                <Text style={styles.dropAddress}>{p.direccion}</Text>
              </View>

              <View style={styles.distPill}>
                <Text style={styles.distText}>{p.dist}</Text>
              </View>
            </View>

            {/* Estado de Horario */}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.openDot,
                  { backgroundColor: p.isOpen ? colors.green : colors.slate400 },
                ]}
              />
              <Text
                style={[
                  styles.openText,
                  { color: p.isOpen ? colors.primaryDark : colors.slate500 },
                ]}
              >
                {p.horario}
              </Text>
            </View>

            {/* Materiales Aceptados */}
            <View style={styles.materialsRow}>
              {p.materiales.map((mat, i) => (
                <View key={i} style={styles.materialTag}>
                  <Text style={styles.materialTagText}>{mat}</Text>
                </View>
              ))}
            </View>

            {/* Footer de Tarjeta y Acción */}
            <View style={styles.dropFooter}>
              <View style={styles.pointsBadge}>
                <Icon name="sparkle" size={12} color={colors.primary} />
                <Text style={styles.pointsBadgeText}>{p.puntosPorEntrega}</Text>
              </View>

              <TouchableOpacity
                style={styles.routeBtn}
                activeOpacity={0.8}
                onPress={() => handleRuta(p.nombre, p.direccion)}
              >
                <Icon name="direction" size={13} color={colors.white} />
                <Text style={styles.routeBtnText}>Cómo llegar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Pasos de Entrega */}
      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>¿Cómo funciona la entrega en el punto?</Text>
        <Text style={styles.stepItem}>
          1. Llevá tus botellas plásticas vacías y aplastadas.
        </Text>
        <Text style={styles.stepItem}>
          2. El operador o buzón inteligente verifica el código escaneado.
        </Text>
        <Text style={styles.stepItem}>
          3. ¡Los puntos se acreditan instantáneamente en tu Billetera!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 18,
    paddingTop: 14,
    paddingBottom: 95,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: 2,
  },
  iconBadgeTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 20,
    ...shadows.sm,
  },
  gpsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gpsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  gpsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.6,
  },
  gpsBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  gpsCoordText: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
    marginBottom: 10,
  },
  recalcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recalcText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 18,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate600,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  listSection: {
    marginBottom: 12,
  },
  dropCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  dropTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dropInfo: {
    flex: 1,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark,
  },
  dropAddress: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: 2,
  },
  distPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  distText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  openText: {
    fontSize: 11,
    fontWeight: '700',
  },
  materialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  materialTag: {
    backgroundColor: colors.slate100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  materialTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate600,
  },
  dropFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.md,
  },
  routeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 8,
  },
  stepItem: {
    fontSize: 11,
    color: colors.slate600,
    lineHeight: 18,
    marginBottom: 4,
  },
});
