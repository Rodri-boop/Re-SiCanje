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
      '¡Transferencia Exitosa!',
      `Se envió la transferencia de $${res.monto.toLocaleString()} ARS a tu cuenta de Mercado Pago.\n\nDestino: ${cvu}\nTitular: ${titular}`,
      [{ text: 'Entendido', onPress: () => navigate('wallet') }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => navigate('wallet')} style={styles.backContainer} activeOpacity={0.7}>
        <Text style={styles.back}>← Volver a Billetera</Text>
      </TouchableOpacity>

      <View style={styles.headerTitleRow}>
        <Text style={styles.title}>Retirar a Mercado Pago</Text>
        <Text style={styles.mpBadge}>MP</Text>
      </View>
      <Text style={styles.subtitle}>Transfiere tus pesos acumulados de forma inmediata.</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Monto disponible para transferir</Text>
        <Text style={styles.bannerValue}>${balance.toLocaleString()} ARS</Text>
      </View>

      <View style={styles.formContainer}>
        <Input 
          label="CVU o Alias de Mercado Pago" 
          placeholder="Ej: tu.alias.mp o 00000031..." 
          value={cvu}
          onChangeText={setCvu} 
          autoCapitalize="none" 
        />
        
        <Input 
          label="Titular de la cuenta" 
          placeholder="Nombre y Apellido completo" 
          value={titular} 
          onChangeText={setTitular} 
        />
        
        <Input 
          label="Monto a transferir (ARS)" 
          value={monto} 
          onChangeText={setMonto} 
          keyboardType="numeric" 
        />

        <View style={{ marginTop: 12 }}>
          <Button variant="mp" title="Confirmar Transferencia" onPress={handleConfirm} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },
  backContainer: { marginBottom: 10 },
  back: { color: colors.mp, fontWeight: 'bold', fontSize: 13 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '900', color: colors.dark },
  mpBadge: {
    backgroundColor: colors.mp,
    color: colors.white,
    fontWeight: '900',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 2, marginBottom: 20 },
  banner: { 
    backgroundColor: '#E0F2FE', 
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  bannerLabel: { fontSize: 12, color: '#0369A1', fontWeight: '600' },
  bannerValue: { fontSize: 30, fontWeight: '900', color: '#0284C7', marginTop: 4 },
  formContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
});