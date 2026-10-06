import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';

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
      `¡Transferencia de $${res.monto.toLocaleString()} ARS enviada!\nDestino: ${cvu}\nTitular: ${titular}`
    );
    navigate('wallet');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <TouchableOpacity onPress={() => navigate('wallet')}>
        <Text style={styles.back}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mercado Pago</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Monto disponible para transferir:</Text>
        <Text style={styles.bannerValue}>${balance.toLocaleString()} ARS</Text>
      </View>

      <Input label="CVU o Alias de Mercado Pago:" placeholder="Ej: usuario.mp" value={cvu}
        onChangeText={setCvu} autoCapitalize="none" />
      <Input label="Titular de la cuenta:" placeholder="Nombre y Apellido" value={titular} onChangeText={setTitular} />
      <Input label="Monto a transferir (ARS):" value={monto} onChangeText={setMonto} keyboardType="numeric" />

      <Button variant="mp" title="Confirmar Transferencia" onPress={handleConfirm} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 90 },
  back: { color: colors.mp, fontWeight: 'bold', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.mp },
  banner: { backgroundColor: '#E0F2FE', padding: 14, borderRadius: 12, marginVertical: 15 },
  bannerLabel: { fontSize: 12, color: '#0369A1' },
  bannerValue: { fontSize: 24, fontWeight: 'bold', color: '#0284C7', marginTop: 2 },
});
