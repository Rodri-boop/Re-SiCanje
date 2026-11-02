import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { formatearPeso, MOBIUS_MATERIALS } from '../utils/mobius';
import { colors } from '../theme/colors';

export default function ScanResultScreen({ navigate }) {
  const { ultimoEscaneo } = useWallet();
  const mat = ultimoEscaneo?.material || MOBIUS_MATERIALS.pet;
  const pesoKg = ultimoEscaneo?.pesoKg || 0.45;
  const valor = ultimoEscaneo?.valor || 90;

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
        <View style={s.okIcon}>
          <Ionicons name="checkmark" size={36} color={colors.white} />
        </View>
        <Text style={s.okTitle}>¡Material registrado con éxito!</Text>
        <Text style={s.okTxt}>
          QR de pesaje procesado y verificado según la norma de reciclabilidad.
        </Text>
      </View>

      <Card style={{ padding: 20 }}>
        {/* Encabezado del material con triángulo de Möbius */}
        <View style={s.mobiusHeader}>
          <View style={[s.mobiusSymbolBox, { backgroundColor: mat.bg }]}>
            <Text style={[s.mobiusSymbol, { color: mat.color }]}>{mat.simbolo}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.siglaRow}>
              <Text style={s.siglaTxt}>{mat.sigla}</Text>
              <Badge label={`Möbius N° ${mat.numero}`} variant="mint" />
            </View>
            <Text style={s.nombreMat}>{mat.nombre}</Text>
          </View>
        </View>

        <Text style={s.matDesc}>{mat.descripcion}</Text>

        <View style={s.sep} />
        <Fila label="Peso registrado" valor={formatearPeso(pesoKg)} color={colors.navy} />
        <View style={s.sep} />
        <Fila label="Tasa de incentivo" valor={`${mat.ptsPorKg} pts / kg`} color={colors.slate} />
        <View style={s.sep} />
        <Fila label="Verificación" valor="QR Verificado" color={colors.green} />
      </Card>

      <View style={s.valor2}>
        <Ionicons name="sparkles" size={34} color={colors.navy} />
        <View style={{ flex: 1 }}>
          <Text style={s.vLabel}>Reci-Points acreditados</Text>
          <Text style={s.vMonto}>+ {valor} pts</Text>
        </View>
      </View>

      <Button variant="green" title="Ver en mi Billetera" onPress={() => navigate('wallet')} />
      <Button variant="outline" title="Escanear otro material" onPress={() => navigate('scan')} style={{ marginBottom: 16 }} />

      <SettingsSection variant="chips" />
    </Screen>
  );
}

const s = StyleSheet.create({
  ok: { backgroundColor: colors.mint, borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 24, padding: 22, alignItems: 'center', marginBottom: 14 },
  okIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  okTitle: { fontSize: 21, fontWeight: '800', color: colors.greenDark, textAlign: 'center' },
  okTxt: { fontSize: 14, color: colors.greenDark, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  mobiusHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  mobiusSymbolBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  mobiusSymbol: { fontSize: 32, fontWeight: '900' },
  siglaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  siglaTxt: { fontSize: 20, fontWeight: '900', color: colors.ink },
  nombreMat: { fontSize: 13, color: colors.slate, marginTop: 2 },
  matDesc: { fontSize: 13, color: colors.slate, lineHeight: 19, marginBottom: 4 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 15, color: colors.slate },
  valor: { fontSize: 16, fontWeight: '800' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  valor2: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.blueSoft, borderRadius: 20, padding: 20, marginBottom: 20 },
  vLabel: { fontSize: 14, color: colors.slate },
  vMonto: { fontSize: 28, fontWeight: '800', color: colors.navy, marginTop: 2 },
});
