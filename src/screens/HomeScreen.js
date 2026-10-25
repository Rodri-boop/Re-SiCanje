import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SettingsSection from '../components/SettingsSection';
import { formatARS } from '../utils/format';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigate }) {
  const { logout } = useAuth();
  const { balance, botellas } = useWallet();
  const co2 = (botellas * 0.0873).toFixed(1).replace('.', ',');
  const agua = Math.round(botellas * 0.317);

  return (
    <Screen>
      <Header title="Recicanje" />

      <View style={s.balance}>
        <View style={s.between}>
          <Text style={s.balLabel}>MI SALDO DISPONIBLE</Text>
          <Badge label="ECO-ACTIVO" variant="green" />
        </View>
        <View style={s.amountRow}>
          <Text style={s.amount}>{formatARS(balance)}</Text>
          <Text style={s.ars}>ARS</Text>
        </View>
        <View style={s.line} />
        <View style={s.between}>
          <View>
            <Text style={s.balSmall}>Plásticos canjeados</Text>
            <Text style={s.balBig}>{botellas} botellas</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.balSmall}>Próximo hito</Text>
            <Text style={[s.balBig, { color: colors.green }]}>$ 50 de regalo</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={s.scan} activeOpacity={0.9} onPress={() => navigate('scan')}>
        <View style={s.scanIcon}><Ionicons name="camera-outline" size={26} color={colors.white} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.scanTitle}>Escaneá un nuevo plástico</Text>
          <Text style={s.scanSub}>Identificá botellas PET y conocé su valor al instante</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.white} />
      </TouchableOpacity>

      <Text style={s.section}>Tu impacto ecológico</Text>
      <View style={s.impacto}>
        <Card style={s.impCard}>
          <Ionicons name="leaf-outline" size={28} color={colors.green} />
          <Text style={s.impLabel}>CO₂ evitado</Text>
          <Text style={s.impValue}>{co2} kg</Text>
        </Card>
        <Card style={s.impCard}>
          <Ionicons name="water-outline" size={28} color={colors.water} />
          <Text style={s.impLabel}>Agua ahorrada</Text>
          <Text style={s.impValue}>{agua} litros</Text>
        </Card>
      </View>

      <Card style={s.info}>
        <Ionicons name="information-circle-outline" size={30} color={colors.navy} />
        <View style={{ flex: 1 }}>
          <Text style={s.infoTitle}>¿Cómo canjear tus botellas?</Text>
          <Text style={s.infoTxt}>Escaneá, depositá en un Resi-Drop y recibí tus acreditaciones en pesos argentinos mediante CBU, CVU o alias.</Text>
        </View>
      </Card>

      <SettingsSection />

      <TouchableOpacity onPress={logout}>
        <Text style={s.logout}>Cerrar sesión</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const s = StyleSheet.create({
  balance: { backgroundColor: colors.navy, borderRadius: 28, padding: 24, marginBottom: 16, shadowColor: colors.navy, shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 14 },
  amount: { fontSize: 46, fontWeight: '800', color: colors.white },
  ars: { fontSize: 18, fontWeight: '700', color: colors.green, marginLeft: 8 },
  line: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 16 },
  balSmall: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  balBig: { fontSize: 18, fontWeight: '800', color: colors.white, marginTop: 2 },
  scan: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.green, borderRadius: 22, padding: 18, marginBottom: 20 },
  scanIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: 18, fontWeight: '800', color: colors.white },
  scanSub: { fontSize: 14, color: 'rgba(255,255,255,0.92)', marginTop: 2 },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 8, marginBottom: 12 },
  impacto: { flexDirection: 'row', gap: 12 },
  impCard: { flex: 1, padding: 18 },
  impLabel: { fontSize: 14, fontWeight: '600', color: colors.slate, marginTop: 12 },
  impValue: { fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: 4 },
  info: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 18 },
  infoTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  infoTxt: { fontSize: 14, color: colors.slate, marginTop: 4, lineHeight: 20 },
  logout: { textAlign: 'center', color: colors.danger, fontWeight: '700', marginTop: 8, padding: 8 },
});