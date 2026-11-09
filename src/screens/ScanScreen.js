import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function OperatorScreen() {
  const [emailUsuario, setEmailUsuario] = useState('');
  const [creditos, setCreditos] = useState('');
  const [qrGenerado, setQrGenerado] = useState(false);
  const [datosQr, setDatosQr] = useState('');

  const handleGenerarQr = () => {
    if (!emailUsuario || !creditos) {
      Alert.alert('Datos incompletos', 'Ingresa el correo del usuario y la cantidad de Re-SiCréditos.');
      return;
    }

    const cantidad = parseInt(creditos, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      Alert.alert('Valor inválido', 'Ingresa un número válido de créditos.');
      return;
    }

    const payload = JSON.stringify({
      creditos: cantidad,
      email: emailUsuario.trim().toLowerCase(),
      punto: 'ReciDrop Autorizado',
      timestamp: Date.now()
    });

    setDatosQr(payload);
    setQrGenerado(true);
  };

  const handleNuevaAutorizacion = () => {
    setEmailUsuario('');
    setCreditos('');
    setQrGenerado(false);
    setDatosQr('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Panel Operador ReciDrop</Text>
      <Text style={styles.subtitle}>Autoriza la entrega de envases y genera el código QR para el usuario.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Generar Autorización de Créditos</Text>

        {!qrGenerado ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo del Usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="usuario@email.com"
                placeholderTextColor={colors.slate400}
                value={emailUsuario}
                onChangeText={setEmailUsuario}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cantidad de Re-SiCréditos</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 50"
                placeholderTextColor={colors.slate400}
                value={creditos}
                onChangeText={setCreditos}
                keyboardType="numeric"
              />
            </View>

            <Button title="Generar QR de Acreditación" onPress={handleGenerarQr} />
          </View>
        ) : (
          <View style={styles.qrResultContainer}>
            <Text style={styles.successTitle}>¡QR Generado con Éxito!</Text>
            <Text style={styles.successSub}>
              Pídele al usuario que escanee este código desde su sección de captura en la aplicación para recibir sus {creditos} Re-SiCréditos en el acto.
            </Text>

            <View style={styles.qrPlaceholderBox}>
              <Text style={styles.qrCodeText}>[ CÓDIGO QR ACTIVO ]</Text>
              <Text style={styles.qrPayloadText} numberOfLines={3}>{datosQr}</Text>
            </View>

            <Button title="Realizar Nueva Autorización" onPress={handleNuevaAutorizacion} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 24, fontWeight: '900', color: colors.dark },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 2, marginBottom: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: { ios: 0.05, android: 0.1 }[Platform.OS] || 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.dark, marginBottom: 16 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: colors.slate700, marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
  },
  qrResultContainer: { alignItems: 'center', width: '100%' },
  successTitle: { fontSize: 18, fontWeight: '800', color: colors.green, marginBottom: 6, textAlign: 'center' },
  successSub: { fontSize: 13, color: colors.slate500, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  qrPlaceholderBox: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCodeText: { fontSize: 16, fontWeight: '900', color: colors.primary, marginBottom: 8 },
  qrPayloadText: { fontSize: 10, color: colors.slate500, textAlign: 'center' },
});
