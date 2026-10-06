import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigate }) {
  const { usuarioActivo, logout } = useAuth();
  const { balance, recycledKg } = useWallet();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hola, {usuarioActivo?.nombre || 'Ecologista'} 👋</Text>
          <Text style={styles.email}>{usuarioActivo?.email}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

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

      <Button variant="green" title="📷 Escanear Botella / Envase" onPress={() => navigate('scan')} />
      <Button variant="primary" title="📍 Puntos de Entrega Cercanos" onPress={() => navigate('map')} />
      <Button variant="mp" title="💳 Retirar con Mercado Pago" onPress={() => navigate('mp_transfer')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: colors.dark },
  email: { fontSize: 12, color: colors.slate500 },
  logoutBtn: { backgroundColor: colors.dangerBg, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { fontSize: 12, color: colors.danger, fontWeight: 'bold' },
});
