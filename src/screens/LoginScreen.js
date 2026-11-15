import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function LoginScreen({ go }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  const entrar = async () => {
    setBusy(true);
    const res = await login({ email, password });
    setBusy(false);
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll} bounces={false} keyboardShouldPersistTaps="handled">
      {/* ─── Sección decorativa superior ─── */}
      <View style={s.topSection}>
        <TouchableOpacity style={s.backBtn} onPress={() => go('welcome')}>
          <Ionicons name="chevron-back" size={22} color={colors.navy} />
        </TouchableOpacity>

        {/* Logo + nombre */}
        <View style={s.brandRow}>
          <Image source={require('../../assets/logo.png')} style={s.logoImg} />
          <View>
            <Text style={s.brandName}>Re-SiCanje</Text>
            <Text style={s.brandSlogan}>Reciclá. Canjeá. Ganá.</Text>
          </View>
        </View>

        {/* Texto motivacional */}
        <Text style={s.motivacional}>Un planeta mejor{'\n'}también depende de vos</Text>

        {/* Globo con hojas */}
        <View style={s.globeArea}>
          <Text style={s.leafLeft}>🍃</Text>
          <View style={s.globe}>
            <Text style={s.globeEmoji}>🌍</Text>
          </View>
          <Text style={s.leafRight}>🍃</Text>
        </View>
      </View>

      {/* ─── Card de login ─── */}
      <View style={s.card}>
        <Text style={s.cardTitle}>¡Bienvenido!</Text>
        <Text style={s.cardSub}>Iniciá sesión y seguí reciclando{'\n'}por un mundo mejor</Text>

        {/* Campo Email */}
        <View style={s.field}>
          <Ionicons name="mail-outline" size={20} color={colors.slate} />
          <TextInput
            style={s.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.slate}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo Contraseña */}
        <View style={s.field}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.slate} />
          <TextInput
            style={s.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.slate}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPass((v) => !v)}>
            <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.slate} />
          </TouchableOpacity>
        </View>

        {/* Olvidé contraseña */}
        <TouchableOpacity onPress={() => go('forgot')} style={s.forgotBtn}>
          <Text style={s.forgotTxt}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Botón de login */}
        <Button variant="green" title="Iniciar sesión  →" onPress={entrar} loading={busy} />

        {/* Link a registro */}
        <TouchableOpacity onPress={() => go('reg1')} style={s.registerRow}>
          <Text style={s.registerTxt}>¿Aún no tenés cuenta? </Text>
          <Text style={s.registerLink}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scroll: { flexGrow: 1 },

  /* ─── Top decorativa ─── */
  topSection: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoImg: { width: 44, height: 44, borderRadius: 22 },
  brandName: { fontSize: 22, fontWeight: '900', color: colors.ink },
  brandSlogan: { fontSize: 12, color: colors.slate, fontWeight: '600' },
  motivacional: { fontSize: 13, color: colors.greenDark, fontWeight: '600', textAlign: 'right', lineHeight: 18, marginTop: -30 },

  globeArea: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 8, gap: 0 },
  leafLeft: { fontSize: 32, transform: [{ rotate: '30deg' }], marginRight: -8 },
  leafRight: { fontSize: 24, transform: [{ rotate: '-40deg' }], marginLeft: -6, marginTop: 30 },
  globe: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#C8E6C9', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#388E3C' },
  globeEmoji: { fontSize: 64 },

  /* ─── Card de login ─── */
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: { fontSize: 28, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  cardSub: { fontSize: 14, color: colors.slate, textAlign: 'center', marginTop: 6, marginBottom: 28, lineHeight: 20 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotTxt: { fontSize: 13, fontWeight: '700', color: colors.navy },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  registerTxt: { fontSize: 14, color: colors.slate },
  registerLink: { fontSize: 14, fontWeight: '800', color: colors.greenDark },
});
