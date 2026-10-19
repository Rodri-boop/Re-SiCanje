import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function WalletScreen({ navigate }) {
  const { balance, recycledKg, movimientos } = useWallet();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Mi Billetera</Text>

      <Card
        backgroundColor={colors.primary}
        label="Balance de Puntos Ecológicos"
        value={`${balance.toLocaleString()} PTS`}
        sub={`≈ $${balance.toLocaleString()} ARS canjeables`}
      />

      <Card
        backgroundColor={colors.green}
        label="Impacto Positivo"
        value={`${recycledKg} Kg`}
        sub="Plástico PET reciclado acumulado"
      />

      <Button
        variant="mp"
        title="Retirar con Mercado Pago"
        onPress={() => navigate('mp_transfer')}
      />

      <Text style={styles.sectionTitle}>Movimientos recientes</Text>
      {movimientos.map((movimiento) => (
        <View key={movimiento.id} style={styles.movement}>
          <Text style={styles.movementText}>{movimiento.texto}</Text>
          <Text
            style={[
              styles.movementAmount,
              movimiento.tipo === 'blue' && styles.withdrawal,
            ]}
          >
            {movimiento.monto}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 90 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.dark, marginTop: 12, marginBottom: 10 },
  movement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  movementText: { flex: 1, color: colors.slate700, fontSize: 13, marginRight: 8 },
  movementAmount: { color: colors.green, fontSize: 13, fontWeight: 'bold' },
  withdrawal: { color: colors.primary },
});
