import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LinkButton from '../components/LinkButton';
import Input from '../components/Input';
import Icon from '../components/Icon';
import { colors, shadows, radii } from '../theme/colors';

const EMPTY_REGISTER = { nombre: '', email: '', password: '', confirm: '' };

export default function AuthScreen() {
  const { login, register, loginWithGoogle, loginDemo } = useAuth();
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
      Alert.alert(
        '¡Revisá tu correo!',
        'Te enviamos un enlace para confirmar tu cuenta. Después podés iniciar sesión.'
      );
      setMode('login');
    } else {
      Alert.alert('¡Cuenta creada!', `Bienvenido a RE-SICANJE, ${res.nombre}.`);
    }
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  const setLogin = (k) => (v) => setLoginForm((p) => ({ ...p, [k]: v }));
  const setReg = (k) => (v) => setRegForm((p) => ({ ...p, [k]: v }));

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Icon name="recycle" size={36} color={colors.primary} />
        </View>
        <Text style={styles.brandTitle}>RE-SICANJE</Text>
        <Text style={styles.brandSubtitle}>
          Transformá tus botellas plásticas en dinero y recompensas reales
        </Text>
      </View>

      {/* Segmented Control Mode Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
          onPress={() => setMode('login')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
          onPress={() => setMode('register')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {mode === 'login' ? (
          <View style={styles.form}>
            <Button
              variant="google"
              title="Continuar con Google"
              onPress={handleGoogle}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o ingresá con tu cuenta</Text>
              <View style={styles.dividerLine} />
            </View>

            <Input
              label="Correo electrónico"
              icon="mail"
              placeholder="tu@correo.com"
              value={loginForm.email}
              onChangeText={setLogin('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Contraseña"
              icon="lock"
              placeholder="••••••••"
              value={loginForm.password}
              onChangeText={setLogin('password')}
              secureTextEntry
            />

            <Button
              title="Ingresar a mi cuenta"
              icon="arrowRight"
              iconPosition="right"
              onPress={handleLogin}
              loading={busy}
              style={styles.mainActionBtn}
            />

            {/* Quick Demo Button */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={loginDemo}
              activeOpacity={0.75}
            >
              <Icon name="sparkle" size={14} color={colors.primaryDark} />
              <Text style={styles.demoText}>Acceso Rápido / Modo Demo</Text>
            </TouchableOpacity>

            <LinkButton
              title="¿No tenés cuenta? Registrate gratis"
              onPress={() => setMode('register')}
              style={styles.switchModeLink}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Nombre y Apellido"
              icon="user"
              placeholder="Ej: Laura Gómez"
              value={regForm.nombre}
              onChangeText={setReg('nombre')}
            />

            <Input
              label="Correo electrónico"
              icon="mail"
              placeholder="tu@correo.com"
              value={regForm.email}
              onChangeText={setReg('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Contraseña"
              icon="lock"
              placeholder="Mínimo 6 caracteres"
              value={regForm.password}
              onChangeText={setReg('password')}
              secureTextEntry
            />

            <Input
              label="Confirmar contraseña"
              icon="lock"
              placeholder="Repetí la contraseña"
              value={regForm.confirm}
              onChangeText={setReg('confirm')}
              secureTextEntry
            />

            <Button
              title="Crear mi cuenta ecológica"
              icon="leaf"
              onPress={handleRegister}
              loading={busy}
              style={styles.mainActionBtn}
            />

            <LinkButton
              title="¿Ya tenés cuenta? Iniciá sesión"
              onPress={() => setMode('login')}
              style={styles.switchModeLink}
            />
          </View>
        )}
      </View>

      {/* Footer Environmental Note */}
      <View style={styles.footerNote}>
        <Icon name="shield" size={14} color={colors.slate400} />
        <Text style={styles.footerText}>
          Tus datos y canjes están protegidos. Proyecto de reciclaje de impacto sustentable.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: colors.bg,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.sm,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.slate500,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.slate100,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate500,
  },
  tabTextActive: {
    color: colors.dark,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  form: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate400,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  mainActionBtn: {
    marginTop: 6,
    marginBottom: 10,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: radii.md,
    marginTop: 4,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  switchModeLink: {
    marginTop: 4,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.slate400,
    textAlign: 'center',
    lineHeight: 15,
  },
});