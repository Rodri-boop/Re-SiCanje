import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useWallet } from '../context/WalletContext';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function WalletScreen({ navigate }) {
  const { balance, recycledKg, movimientos } = useWallet();

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Mi Billetera</Text>
        <Text style={styles.subtitle}>Tus Re-SiCréditos acumulados e historial de transacciones.</Text>
      </View>

      <Card
        backgroundColor={colors.primary}
        label="Balance de Re-SiCréditos"
        value={`${balance.toLocaleString()} CRÉDITOS`}
        sub="Canjeables por beneficios en comercios"
        style={styles.cardShadow}
      />

      <Card
        backgroundColor={colors.green}
        label="Impacto Positivo Acumulado"
        value={`${recycledKg} Kg`}
        sub="Plástico PET y envases reciclados"
        style={styles.cardShadow}
      />

      <TouchableOpacity 
        style={styles.benefitBanner} 
        onPress={() => navigate('scan')}
        activeOpacity={0.8}
      >
        <View style={styles.benefitContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.benefitTitle}>Escanear el QR de los ReciDrops</Text>
            <Text style={styles.benefitSub}>Escanea el código en el punto para obtener tus Re-SiCréditos</Text>
          </View>
          <Text style={styles.benefitArrow}>→</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Movimientos Recientes</Text>
      
      {movimientos.map((movimiento) => {
        const isUsage = movimiento.tipo === 'blue';
        return (
          <View key={movimiento.id} style={styles.movementCard}>
            <Text style={styles.movementText} numberOfLines={2}>{movimiento.texto}</Text>
            <Text style={[styles.movementAmount, isUsage && styles.usageAmount]}>
              {movimiento.monto}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 110 },
  topHeader: { marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '900', color: colors.dark },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.dark, marginTop: 16, marginBottom: 12 },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  benefitBanner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitContent: { flexDirection: 'row', alignItems: 'center' },
  benefitTitle: { fontSize: 15, fontWeight: '800', color: colors.white },
  benefitSub: { fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 1 },
  benefitArrow: { fontSize: 18, fontWeight: '900', color: colors.white },
  movementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  movementText: { flex: 1, color: colors.slate700, fontSize: 13, fontWeight: '600', marginRight: 8 },
  movementAmount: { color: colors.green, fontSize: 13, fontWeight: '800' },
  usageAmount: { color: colors.primary },
});
