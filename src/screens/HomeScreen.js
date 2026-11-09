import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigate }) {
  const { usuarioActivo, logout } = useAuth();
  const { balance, recycledKg } = useWallet();

  const getInitials = (name) => {
    if (!name) return 'FO';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(usuarioActivo?.nombre)}</Text>
          </View>
          <View style={styles.userTexts}>
            <Text style={styles.greeting}>Hola, {usuarioActivo?.nombre || 'Federico'}</Text>
            <Text style={styles.email} numberOfLines={1}>{usuarioActivo?.email || 'fede_k-poloko@hotmail.com'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Card
        backgroundColor={colors.primary}
        label="Balance de Re-SiCréditos"
        value={`${balance.toLocaleString()} CRÉDITOS`}
        sub="Canjeables por beneficios y descuentos"
        style={styles.cardShadow}
      />
      
      <Card
        backgroundColor={colors.green}
        label="Impacto Ambiental Positivo"
        value={`${recycledKg} Kg`}
        sub="Plástico PET y envases reciclados acumulados"
        style={styles.cardShadow}
      />

      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]} 
          onPress={() => navigate('scan')}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionTitle, { color: '#065F46' }]}>Tomar Fotos</Text>
          <Text style={styles.actionSub}>Fotografía tus envases previos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]} 
          onPress={() => navigate('map')}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionTitle, { color: '#1E40AF' }]}>ReciDrops Cercanos</Text>
          <Text style={styles.actionSub}>Encuentra dónde reciclar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.creditActionCard} 
        onPress={() => navigate('scan')}
        activeOpacity={0.8}
      >
        <View style={styles.creditRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.creditTitle}>Escanear el QR de los ReciDrops</Text>
            <Text style={styles.creditSub}>Escanea el código en el punto para obtener tus Re-SiCréditos</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 110 },
  headerCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 15, fontWeight: '900', color: colors.slate700 },
  userTexts: { flex: 1 },
  greeting: { fontSize: 16, fontWeight: '800', color: colors.dark },
  email: { fontSize: 11, color: colors.slate500, marginTop: 2 },
  logoutBtn: { 
    backgroundColor: '#FEF2F2', 
    paddingVertical: 7, 
    paddingHorizontal: 12, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: { fontSize: 11, color: '#EF4444', fontWeight: '700' },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
    marginTop: 10,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  actionSub: { fontSize: 11, color: colors.slate500 },
  creditActionCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  creditRow: { flexDirection: 'row', alignItems: 'center' },
  creditTitle: { fontSize: 14, fontWeight: '800', color: colors.dark },
  creditSub: { fontSize: 11, color: colors.slate500, marginTop: 1 },
  chevron: { fontSize: 16, fontWeight: 'bold', color: colors.slate400 },
});
