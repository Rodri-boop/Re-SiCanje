import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Field from '../components/Field';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function ForgotPasswordScreen({ go }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setBusy(true);
    const res = await resetPassword(email);
    setBusy(false);
    if (!res.ok) {
      Alert.alert(res.title, res.message);
    } else {
      setSent(true);
    }
  };

  return (
    <Screen nav={false}>
      <Header title="Recuperar contraseña" onBack={() => go('login')} />

      {sent ? (
        <View style={s.successBox}>
          <View style={s.successIcon}>
            <Ionicons name="mail-outline" size={40} color={colors.white} />
          </View>
          <Text style={s.successTitle}>¡Correo enviado!</Text>
          <Text style={s.successText}>
            Te enviamos un enlace a{'\n'}
            <Text style={{ fontWeight: '800', color: colors.ink }}>{email}</Text>
            {'\n'}para restablecer tu contraseña.
          </Text>
          <Text style={s.successHint}>Revisá tu bandeja de entrada y spam.</Text>
          <Button variant="green" title="Volver a iniciar sesión" onPress={() => go('login')} style={{ marginTop: 20 }} />
        </View>
      ) : (
        <>
          <View style={s.iconBox}>
            <Ionicons name="lock-closed-outline" size={40} color={colors.navy} />
          </View>
          <Text style={s.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={s.sub}>
            Ingresá el correo con el que te registraste y te enviaremos un enlace para restablecerla.
          </Text>
          <Field
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="tu@email.com"
          />
          <Button variant="green" title="Enviar enlace de recuperación" onPress={handleReset} loading={busy} icon="send-outline" style={{ marginTop: 8 }} />
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  iconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  sub: { fontSize: 15, color: colors.slate, textAlign: 'center', marginTop: 8, marginBottom: 24, lineHeight: 22 },
  successBox: { alignItems: 'center', paddingTop: 20 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: '800', color: colors.ink },
  successText: { fontSize: 15, color: colors.slate, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  successHint: { fontSize: 13, color: colors.slate, marginTop: 12 },
});

