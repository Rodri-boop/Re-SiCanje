import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { DROPS } from './MapScreen';
import { colors } from '../theme/colors';

export default function DropDetailScreen({ navigate, params }) {
  const { usuarioActivo } = useAuth();
  const d = params?.drop || DROPS[0];
  // TODO: este código debería generarlo el servidor, con vencimiento y de un solo uso
  const codigo = `recicanje:${usuarioActivo?.id}:${d.id}`;

  const Dato = ({ label, valor, color = colors.ink }) => (
    <View>
      <Text style={s.dLabel}>{label}</Text>
      <Text style={[s.dValor, { color }]}>{valor}</Text>
    </View>
  );

  return (
    <Screen>
      <Header title="Detalle del Resi-Drop" onBack={() => navigate('map')} />

      <Card style={{ padding: 20 }}>
        <View style={s.nombreRow}>
          <Text style={s.nombre}>{d.nombre}</Text>
          <Badge label="Punto automatizado" variant="mint" />
        </View>
        <Text style={s.desc}>{d.desc}</Text>
        <View style={s.sep} />
        <View style={s.datos}>
          <Dato label="Horario" valor={d.horario} />
          <Dato label="Materiales" valor={d.materiales} color={colors.green} />
          <Dato label="Multiplicador" valor={`${d.mult} créditos`} color={colors.navy} />
        </View>
      </Card>

      <View style={s.terminal}>
        <Text style={s.tTitle}>CANJEÁ EN TERMINAL</Text>
        <Text style={s.tTxt}>Presentá este código en la terminal del punto para registrar tu canje automáticamente.</Text>
        <View style={s.qr}>
          <QRCode value={codigo} size={150} />
        </View>
        <Text style={s.tActivo}>CÓDIGO ACTIVO • ESCANEÁ</Text>
      </View>

      <Button variant="outline" title="Volver al inicio" onPress={() => navigate('home')} style={{ marginBottom: 16 }} />

      <SettingsSection />
    </Screen>
  );
}

const s = StyleSheet.create({
  nombreRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  nombre: { fontSize: 20, fontWeight: '800', color: colors.ink },
  desc: { fontSize: 15, color: colors.slate, marginTop: 10, lineHeight: 22 },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  datos: { flexDirection: 'row', justifyContent: 'space-between' },
  dLabel: { fontSize: 13, color: colors.slate },
  dValor: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  terminal: { backgroundColor: colors.navy, borderRadius: 28, padding: 22, alignItems: 'center', marginBottom: 16 },
  tTitle: { fontSize: 18, fontWeight: '800', color: colors.white },
  tTxt: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 8, lineHeight: 21 },
  qr: { backgroundColor: colors.white, borderRadius: 24, padding: 24, marginVertical: 20 },
  tActivo: { fontSize: 14, fontWeight: '800', color: colors.green, letterSpacing: 0.5 },
});