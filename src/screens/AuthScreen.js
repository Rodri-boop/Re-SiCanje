import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton';
import Input from '../components/Input';
import { colors } from '../theme/colors';

const EMPTY_REGISTER = { nombre: '', email: '', password: '', confirm: '' };

export default function AuthScreen() {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState(EMPTY_REGISTER);
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    const res = await login(loginForm);
    setBusy(false);
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  const handleRegister = async () => {
    setBusy(true);
    const res = await register(regForm);
    setBusy(false);
    if (!res.ok) return Alert.alert(res.title, res.message);

    setRegForm(EMPTY_REGISTER);
    if (res.needsConfirmation) {
      Alert.alert('¡Revisá tu correo!', 'Te enviamos un enlace para confirmar tu cuenta. Después podés iniciar sesión.');
      setMode('login');
    } else {
      Alert.alert('¡Cuenta creada!', `Bienvenido a RECICANJE, ${res.nombre}.`);
    }
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  const setLogin = (k) => (v) => setLoginForm((p) => ({ ...p, [k]: v }));
  const setReg = (k) => (v) => setRegForm((p) => ({ ...p, [k]: v }));

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.logoCircle}><Text style={styles.logoIcon}>♻</Text></View>
      <Text style={styles.title}>RECICANJE</Text>
      <Text style={styles.subtitle}>Transformá tus reciclables en dinero y beneficios</Text>

      <View style={styles.tabs}>
        {[['login', 'Iniciar Sesión'], ['register', 'Registrarse']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, mode === key && styles.tabActive]}
            onPress={() => setMode(key)}
          >
            <Text style={[styles.tabText, mode === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === 'login' ? (
        <View style={styles.form}>
          <Button variant="google" title="🔴 Continuar con Google" onPress={handleGoogle} />
          <Text style={styles.divider}>— o ingresá con tus datos —</Text>
          <Input placeholder="Correo electrónico" value={loginForm.email} onChangeText={setLogin('email')}
            autoCapitalize="none" keyboardType="email-address" />
          <Input placeholder="Contraseña" value={loginForm.password} onChangeText={setLogin('password')} secureTextEntry />
          <Button title="Entrar" onPress={handleLogin} loading={busy} />
          <LinkButton title="¿No tenés cuenta? Registrate acá" onPress={() => setMode('register')} />
        </View>
      ) : (
        <View style={styles.form}>
          <Input placeholder="Nombre y Apellido" value={regForm.nombre} onChangeText={setReg('nombre')} />
          <Input placeholder="Correo electrónico" value={regForm.email} onChangeText={setReg('email')}
            autoCapitalize="none" keyboardType="email-address" />
          <Input placeholder="Crear Contraseña" value={regForm.password} onChangeText={setReg('password')} secureTextEntry />
          <Input placeholder="Repetir Contraseña" value={regForm.confirm} onChangeText={setReg('confirm')} secureTextEntry />
          <Button variant="green" title="Crear Cuenta" onPress={handleRegister} loading={busy} />
          <LinkButton title="¿Ya tenés cuenta? Iniciá sesión" onPress={() => setMode('login')} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoIcon: { fontSize: 34, color: colors.green },
  title: { fontSize: 26, fontWeight: '900', color: colors.dark, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.slate500, textAlign: 'center', marginBottom: 20 },
  tabs: { flexDirection: 'row', width: '100%', backgroundColor: colors.border, borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.white },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.slate500 },
  tabTextActive: { color: colors.dark, fontWeight: 'bold' },
  form: { width: '100%', alignItems: 'center' },
  divider: { fontSize: 12, color: colors.slate400, marginVertical: 12 },
});