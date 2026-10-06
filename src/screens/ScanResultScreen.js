import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton';
import { colors } from '../theme/colors';

export default function ScanResultScreen({ navigate }) {
  const { puntosPorBotella, ultimoCodigo } = useWallet();

  return (
    <View style={styles.container}>
      <View style={styles.checkCircle}><Text style={styles.checkIcon}>✓</Text></View>
      <Text style={styles.title}>¡Envase Detectado!</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Código: <Text style={styles.bold}>{ultimoCodigo}</Text></Text>
        <Text style={styles.points}>+{puntosPorBotella} Puntos Ecológicos (${puntosPorBotella} ARS)</Text>
      </View>

      <Button variant="primary" title="Depositar en Punto de Entrega" onPress={() => navigate('map')} />
      <Button variant="mp" title="Canjear en Mercado Pago" onPress={() => navigate('mp_transfer')} />
      <LinkButton title="Escanear otro envase" onPress={() => navigate('scan')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  checkCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  checkIcon: { fontSize: 34, color: colors.green, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginBottom: 14 },
  infoCard: { width: '100%', backgroundColor: colors.white, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 18 },
  infoText: { fontSize: 14, color: colors.slate600, marginBottom: 4 },
  bold: { fontWeight: 'bold', color: colors.dark },
  points: { fontSize: 16, fontWeight: 'bold', color: colors.green, marginTop: 8 },
});