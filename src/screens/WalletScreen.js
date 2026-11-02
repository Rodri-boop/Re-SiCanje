import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { formatARS } from '../utils/format';
import { colors } from '../theme/colors';

export default function WalletScreen({ navigate }) {
  const { balance, movimientos } = useWallet();

  return (
    <Screen>
      <Header title="Mi billetera Recicanje" onBack={() => navigate('home')} />

      <View style={s.card}>
        <View style={s.between}>
          <Text style={s.cLabel}>SALDO EN RECI-POINTS</Text>
          <View style={s.iconBadge}>
            <Ionicons name="sparkles" size={18} color={colors.green} />
          </View>
        </View>

        <View style={s.montoRow}>
          <Text style={s.cMonto}>{formatARS(balance)}</Text>
          <Text style={s.cUnit}>pts</Text>
        </View>

        <Text style={s.cSub}>Puntos acumulados disponibles para canjear en comercios</Text>

        <Button
          variant="green"
          icon="storefront-outline"
          title="Canjear en locales adheridos"
          style={s.btnCanjear}
          onPress={() => navigate('stores')}
        />
      </View>

      <Text style={s.section}>Historial de movimientos</Text>
      {movimientos.map((m, i) => {
        const ingreso = m.monto > 0;
        return (
          <View key={m.id}>
            <View style={s.mov}>
              <View style={[s.movIcon, { backgroundColor: ingreso ? colors.mint : colors.blueSoft }]}>
                <Feather name={m.icono} size={22} color={ingreso ? colors.greenDark : colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.movTitulo}>{m.titulo}</Text>
                <Text style={s.movDetalle}>{m.detalle}</Text>
              </View>
              <Text style={[s.movMonto, { color: ingreso ? colors.green : colors.ink }]}>
                {ingreso ? '+' : '-'} {formatARS(Math.abs(m.monto))} pts
              </Text>
            </View>
            {i < movimientos.length - 1 && <View style={s.sep} />}
          </View>
        );
      })}

      <View style={{ height: 16 }} />
      <SettingsSection variant="check" />
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.ink, borderRadius: 28, padding: 22, marginBottom: 22 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  cLabel: { fontSize: 13, fontWeight: '700', color: colors.slate, letterSpacing: 0.5 },
  montoRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12 },
  cMonto: { fontSize: 42, fontWeight: '800', color: colors.white },
  cUnit: { fontSize: 20, fontWeight: '800', color: colors.green, marginLeft: 8 },
  cSub: { fontSize: 14, color: colors.slate, marginTop: 4, marginBottom: 20 },
  btnCanjear: { minHeight: 52, borderRadius: 16, marginBottom: 0 },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 14 },
  mov: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 6 },
  movIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  movTitulo: { fontSize: 17, fontWeight: '800', color: colors.ink },
  movDetalle: { fontSize: 14, color: colors.slate, marginTop: 2 },
  movMonto: { fontSize: 17, fontWeight: '800' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
});
