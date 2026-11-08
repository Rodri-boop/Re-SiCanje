import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

const PRESET_AMOUNTS = [500, 1000, 2000];

export default function MPTransferScreen({ navigate }) {
  const { balance, withdraw } = useWallet();
  const [cvu, setCvu] = useState('');
  const [titular, setTitular] = useState('');
  const [monto, setMonto] = useState(String(balance));

  const handleConfirm = () => {
    const res = withdraw({ cvu, titular, monto });
    if (!res.ok) return Alert.alert(res.title, res.message);
    Alert.alert(
      'Mercado Pago',
      `¡Transferencia de $${res.monto.toLocaleString()} ARS enviada!\n\nDestino: ${cvu}\nTitular: ${titular}\n\nLos fondos ya están disponibles en tu cuenta de Mercado Pago.`
    );
    navigate('wallet');
  };

  const handlePreset = (amount) => {
    const finalAmount = Math.min(amount, balance);
    setMonto(String(finalAmount));
  };

  const handleAll = () => {
    setMonto(String(balance));
  };

  const montoNum = parseInt(monto, 10) || 0;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Volver */}
      <TouchableOpacity
        onPress={() => navigate('wallet')}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <Icon name="arrowLeft" size={16} color={colors.mpDark} />
        <Text style={styles.backText}>Volver a la billetera</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.mpLogoCircle}>
          <Icon name="mp" size={22} color={colors.white} />
        </View>
        <View>
          <Text style={styles.title}>Mercado Pago</Text>
          <Text style={styles.subtitle}>Retiro directo de tus Reci-Créditos</Text>
        </View>
      </View>

      {/* Banner de Saldo Disponible */}
      <View style={styles.balanceBanner}>
        <View style={styles.bannerTop}>
          <Text style={styles.bannerLabel}>SALDO DISPONIBLE PARA RETIRO</Text>
          <View style={styles.noFeeBadge}>
            <Text style={styles.noFeeText}>0% Comisión</Text>
          </View>
        </View>
        <Text style={styles.bannerAmount}>${balance.toLocaleString()} ARS</Text>
        <Text style={styles.bannerNote}>Acreditación inmediata vía CVU o Alias</Text>
      </View>

      {/* Selector Rápido de Montos */}
      <Text style={styles.sectionHeader}>SELECCIÓN RÁPIDA DE MONTO</Text>
      <View style={styles.presetRow}>
        {PRESET_AMOUNTS.map((amt) => (
          <TouchableOpacity
            key={amt}
            style={[
              styles.presetChip,
              montoNum === amt && styles.presetChipActive,
            ]}
            onPress={() => handlePreset(amt)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.presetChipText,
                montoNum === amt && styles.presetChipTextActive,
              ]}
            >
              ${amt.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.presetChip,
            montoNum === balance && styles.presetChipActive,
          ]}
          onPress={handleAll}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.presetChipText,
              montoNum === balance && styles.presetChipTextActive,
            ]}
          >
            Todo el saldo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulario de Retiro */}
      <View style={styles.formCard}>
        <Input
          label="CVU o Alias de Mercado Pago"
          icon="shield"
          placeholder="Ej: tu.usuario.mp o 00000031..."
          value={cvu}
          onChangeText={setCvu}
          autoCapitalize="none"
        />

        <Input
          label="Titular de la cuenta destino"
          icon="user"
          placeholder="Nombre y Apellido del titular"
          value={titular}
          onChangeText={setTitular}
        />

        <Input
          label="Monto a transferir (ARS)"
          icon="wallet"
          placeholder="Monto en pesos"
          value={monto}
          onChangeText={setMonto}
          keyboardType="numeric"
        />

        {/* Desglose de Operación */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Monto solicitado:</Text>
            <Text style={styles.breakdownVal}>${montoNum.toLocaleString()} ARS</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Costo del canje:</Text>
            <Text style={[styles.breakdownVal, { color: colors.primary }]}>
              $0 (Bonificado)
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownTotalLabel}>Recibís en Mercado Pago:</Text>
            <Text style={styles.breakdownTotalVal}>
              ${montoNum.toLocaleString()} ARS
            </Text>
          </View>
        </View>

        <Button
          variant="mp"
          title="Confirmar Transferencia"
          icon="arrowRight"
          iconPosition="right"
          onPress={handleConfirm}
          style={styles.confirmBtn}
        />
      </View>

      {/* Footnote */}
      <View style={styles.securityNote}>
        <Icon name="shield" size={14} color={colors.slate400} />
        <Text style={styles.securityText}>
          Transferencia procesada de forma segura mediante la red oficial de pagos.
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginBottom: 14,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mpDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mpLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mp,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
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
  balanceBanner: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: radii.lg,
    padding: 18,
    marginBottom: 18,
    ...shadows.sm,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.6,
  },
  noFeeBadge: {
    backgroundColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  noFeeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  bannerAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  bannerNote: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.slate400,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  presetChip: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipActive: {
    backgroundColor: colors.mp,
    borderColor: colors.mp,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slate600,
  },
  presetChipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.card,
  },
  breakdownCard: {
    backgroundColor: colors.slate50,
    borderRadius: radii.md,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.slate600,
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.dark,
  },
  breakdownTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.mpDark,
  },
  confirmBtn: {
    marginTop: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  securityText: {
    fontSize: 11,
    color: colors.slate400,
    textAlign: 'center',
    lineHeight: 16,
  },
});
