import React, { useState } from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Field from '../components/Field';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function LoginScreen({ go }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const entrar = async () => {
    setBusy(true);
    const res = await login({ email, password });
    setBusy(false);
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  return (
    <Screen nav={false}>
      <Header title="Iniciá sesión" onBack={() => go('welcome')} />
      <Text style={s.sub}>Ingresá con tu cuenta para seguir reciclando.</Text>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="tu@email.com" />
      <Field label="Contraseña" value={password} onChangeText={setPassword} secure placeholder="********" />
      <Button variant="green" title="Entrar" onPress={entrar} loading={busy} style={{ marginTop: 8 }} />
      <TouchableOpacity onPress={() => go('reg1')}>
        <Text style={s.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const s = StyleSheet.create({
  sub: { fontSize: 15, color: colors.slate, marginBottom: 20 },
  link: { textAlign: 'center', color: colors.navy, fontWeight: '700', marginTop: 14 },
});