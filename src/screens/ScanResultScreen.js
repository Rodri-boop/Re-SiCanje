import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

export default function ScanResultScreen({ navigate }) {
  const { puntosPorBotella, ultimoCodigo } = useWallet();

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Ícono de Celebración */}
      <View style={styles.successCircle}>
        <Icon name="check" size={38} color={colors.primary} />
      </View>

      <Text style={styles.title}>¡Envase Reconocido!</Text>
      <Text style={styles.subtitle}>
        Tu botella plástica fue verificada y sumaste recompensas
      </Text>

      {/* Ficha Técnica del Envase */}
      <View style={styles.specCard}>
        <View style={styles.specHeader}>
          <View style={styles.materialTag}>
            <Text style={styles.materialTagText}>♳ RECICLABLE GRADO 1</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Icon name="sparkle" size={12} color={colors.primary} />
            <Text style={styles.verifiedText}>PET Válido</Text>
          </View>
        </View>

        <Text style={styles.specProduct}>Botella Plástica PET 500ml</Text>
        <Text style={styles.specBarcode}>
          Código: <Text style={styles.codeBold}>{ultimoCodigo}</Text>
        </Text>

        <View style={styles.divider} />

        {/* Puntos y Recompensa */}
        <View style={styles.rewardRow}>
          <View>
            <Text style={styles.rewardLabel}>RECOMPENSA ACREDITADA</Text>
            <Text style={styles.rewardValue}>+{puntosPorBotella} Puntos</Text>
          </View>
          <View style={styles.arsBadge}>
            <Text style={styles.arsText}>+${puntosPorBotella} ARS</Text>
          </View>
        </View>

        {/* Impacto Positivo */}
        <View style={styles.impactRow}>
          <View style={styles.impactItem}>
            <Icon name="bottle" size={14} color={colors.primary} />
            <Text style={styles.impactText}>+50g PET recuperado</Text>
          </View>
          <View style={styles.impactItem}>
            <Icon name="co2" size={14} color="#2563EB" />
            <Text style={styles.impactText}>~100g CO₂ evitado</Text>
          </View>
        </View>
      </View>

      {/* Próximos pasos */}
      <View style={styles.actionSection}>
        <Button
          variant="primary"
          title="Depositar en un Punto Reci-Drop"
          icon="map"
          onPress={() => navigate('map')}
          style={styles.mainBtn}
        />

        <Button
          variant="mp"
          title="Canjear saldo en Mercado Pago"
          icon="mp"
          onPress={() => navigate('mp_transfer')}
          style={styles.mainBtn}
        />

        <LinkButton
          title="📷 Escanear otra botella o envase"
          icon="camera"
          onPress={() => navigate('scan')}
          style={styles.linkScan}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 36,
    paddingBottom: 90,
    backgroundColor: colors.bg,
  },
  successCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primarySoft,
    borderWidth: 2.5,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.card,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.slate500,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  specCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
    ...shadows.card,
  },
  specHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  materialTag: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  materialTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  specProduct: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  specBarcode: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: 4,
  },
  codeBold: {
    fontWeight: '700',
    color: colors.slate700,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.6,
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 2,
  },
  arsBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  arsText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.slate50,
    borderRadius: radii.md,
    padding: 10,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate600,
  },
  actionSection: {
    width: '100%',
  },
  mainBtn: {
    marginBottom: 10,
  },
  linkScan: {
    marginTop: 6,
  },
});