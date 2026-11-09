import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LinkButton from '../components/LinkButton';
import Input from '../components/Input';
import { colors } from '../theme/colors';

const EMPTY_REGISTER = { nombre: '', email: '', password: '', confirm: '' };

export default function AuthScreen() {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState(EMPTY_REGISTER);
  const [forgotEmail, setForgotEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    try {
      const res = await login(loginForm);
      if (!res.ok) Alert.alert('Atención', res.message);
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async () => {
    setBusy(true);
    try {
      const res = await register(regForm);
      if (!res.ok) {
        Alert.alert('Atención', res.message);
        return;
      }
      setRegForm(EMPTY_REGISTER);
      if (res.needsConfirmation) {
        Alert.alert('Revisa tu correo', 'Te enviamos un enlace para confirmar tu cuenta.');
        setMode('login');
      } else {
        Alert.alert('Cuenta creada', `Bienvenido a Re-SiCanje, ${res.nombre}.`);
      }
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error inesperado al registrarse.');
    } finally {
      setBusy(false);
    }
  };

  const handleSendReset = () => {
    if (!forgotEmail) {
      Alert.alert('Campo vacío', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    setBusy(true);
    try {
      resetPassword(forgotEmail).catch(() => {});
    } catch (e) {}

    setTimeout(() => {
      setBusy(false);
      Alert.alert(
        'Correo enviado',
        'Si el correo está registrado, te enviaremos las instrucciones de recuperación.',
        [{ text: 'OK', onPress: () => setMode('login') }]
      );
    }, 400);
  };

  const setLogin = (k) => (v) => setLoginForm((p) => ({ ...p, [k]: v }));
  const setReg = (k) => (v) => setRegForm((p) => ({ ...p, [k]: v }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.background}>
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Re-SiCanje</Text>
            <Text style={styles.subtitle}>Transforma tus reciclables en dinero y beneficios reales</Text>
          </View>

          <View style={styles.cardContainer}>
            {mode !== 'forgot' && (
              <View style={styles.tabs}>
                {[['login', 'Iniciar Sesión'], ['register', 'Registrarse']].map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.tab, mode === key && styles.tabActive]}
                    onPress={() => setMode(key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, mode === key && styles.tabTextActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {mode === 'login' && (
              <View style={styles.form}>
                <Input
                  label="Correo electrónico"
                  placeholder="tucorreo@email.com"
                  value={loginForm.email}
                  onChangeText={setLogin('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <Input
                  label="Contraseña"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChangeText={setLogin('password')}
                  secureTextEntry
                />
                
                <LinkButton 
                  title="¿Olvidaste tu contraseña?" 
                  onPress={() => {
                    setForgotEmail(loginForm.email);
                    setMode('forgot');
                  }} 
                  color={colors.primary} 
                  align="right"
                  style={{ marginTop: -4, marginBottom: 10 }}
                />

                <TouchableOpacity style={styles.mainButton} onPress={handleLogin} activeOpacity={0.8}>
                  <Text style={styles.mainButtonText}>{busy ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
                </TouchableOpacity>

                <LinkButton title="¿No tienes una cuenta? Registrate aquí" onPress={() => setMode('register')} />
              </View>
            )}

            {mode === 'register' && (
              <View style={styles.form}>
                <Input
                  label="Nombre y Apellido"
                  placeholder="Juan Pérez"
                  value={regForm.nombre}
                  onChangeText={setReg('nombre')}
                />
                <Input
                  label="Correo electrónico"
                  placeholder="tucorreo@email.com"
                  value={regForm.email}
                  onChangeText={setReg('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <Input
                  label="Crear Contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={regForm.password}
                  onChangeText={setReg('password')}
                  secureTextEntry
                />
                <Input
                  label="Repetir Contraseña"
                  placeholder="Repetir contraseña"
                  value={regForm.confirm}
                  onChangeText={setReg('confirm')}
                  secureTextEntry
                />
                <View style={{ height: 10 }} />
                
                <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.green }]} onPress={handleRegister} activeOpacity={0.8}>
                  <Text style={styles.mainButtonText}>{busy ? 'Registrando...' : 'Crear Cuenta'}</Text>
                </TouchableOpacity>

                <LinkButton title="¿Ya tienes cuenta? Inicia sesión" onPress={() => setMode('login')} />
              </View>
            )}

            {mode === 'forgot' && (
              <View style={styles.form}>
                <Text style={styles.forgotTitle}>Recuperar Contraseña</Text>
                <Text style={styles.forgotSubtitle}>Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.</Text>
                
                <Input
                  label="Correo electrónico"
                  placeholder="tucorreo@email.com"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <View style={{ height: 10 }} />
                
                <TouchableOpacity style={styles.mainButton} onPress={handleSendReset} activeOpacity={0.8}>
                  <Text style={styles.mainButtonText}>{busy ? 'Enviando...' : 'Enviar Instrucciones'}</Text>
                </TouchableOpacity>

                <LinkButton title="Volver al inicio de sesión" onPress={() => setMode('login')} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%', backgroundColor: '#0F172A' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#059669' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60 },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900', color: colors.white, marginBottom: 4, letterSpacing: 0.5 },
  subtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', paddingHorizontal: 20, fontWeight: '500' },
  cardContainer: { backgroundColor: colors.white, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  tabs: { flexDirection: 'row', width: '100%', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.slate500 },
  tabTextActive: { color: colors.dark, fontWeight: '700' },
  form: { width: '100%' },
  forgotTitle: { fontSize: 18, fontWeight: '900', color: colors.dark, marginBottom: 6 },
  forgotSubtitle: { fontSize: 12, color: colors.slate500, lineHeight: 18, marginBottom: 16 },
  mainButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
