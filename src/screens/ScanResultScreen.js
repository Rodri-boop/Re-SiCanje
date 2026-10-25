import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { colors } from '../theme/colors';

const POR_DEFECTO = { material: 'PET 1 (polietileno)', peso: '~45 gramos', confianza: '98,4 %', valor: 15 };

export default function ScanResultScreen({ navigate }) {
  const { ultimoEscaneo } = useWallet();
  const e = ultimoEscaneo || POR_DEFECTO;

  const Fila = ({ label, valor, color = colors.ink }) => (
    <View style={s.fila}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.valor, { color }]}>{valor}</Text>
    </View>
  );

  return (
    <Screen>
      <Header title="Resultado del escaneo" onBack={() => navigate('scan')} />

      <View style={s.ok}>
        <View style={s.okIcon}><Ionicons name="checkmark" size={36} color={colors.white} /></View>
        <Text style={s.okTitle}>¡Plástico identificado!</Text>
        <Text style={s.okTxt}>PET tipo 1 de alta reciclabilidad detectado correctamente.</Text>
      </View>

      <Card style={{ padding: 20 }}>
        <Text style={s.cardHead}>Detalles del material</Text>
        <Fila label="Material" valor={e.material} />
        <View style={s.sep} />
        <Fila label="Peso estimado" valor={e.peso} />
        <View style={s.sep} />
        <Fila label="Confianza de IA" valor={`${e.confianza} seguro`} color={colors.green} />
      </Card>

      <View style={s.valor2}>
        <Ionicons name="ribbon-outline" size={34} color={colors.navy} />
        <View>
          <Text style={s.vLabel}>Valor estimado del canje</Text>
          <Text style={s.vMonto}>+ ${e.valor}</Text>
        </View>
      </View>

      <Button variant="primary" title="Buscá un Resi-Drop cercano" onPress={() => navigate('map')} />
      <Button variant="outline" title="Escaneá de nuevo" onPress={() => navigate('scan')} style={{ marginBottom: 16 }} />

      <SettingsSection variant="chips" />
    </Screen>
  );
}

const s = StyleSheet.create({
  ok: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 24, padding: 22, alignItems: 'center', marginBottom: 14 },
  okIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  okTitle: { fontSize: 22, fontWeight: '800', color: colors.greenDark },
  okTxt: { fontSize: 15, color: colors.greenDark, textAlign: 'center', marginTop: 6, lineHeight: 22 },
  cardHead: { fontSize: 16, fontWeight: '800', color: colors.slate, marginBottom: 12 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, color: colors.slate },
  valor: { fontSize: 16, fontWeight: '800' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  valor2: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.blueSoft, borderRadius: 20, padding: 20, marginBottom: 20 },
  vLabel: { fontSize: 15, color: colors.slate },
  vMonto: { fontSize: 28, fontWeight: '800', color: colors.navy, marginTop: 2 },
});