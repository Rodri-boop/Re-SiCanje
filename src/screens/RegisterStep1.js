import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Screen from '../components/Screen';
import { Avatar } from '../components/Header';
import Field from '../components/Field';
import Select from '../components/Select';
import Button from '../components/Button';
import { validarNombre, validarEmail, validarCuil, validarUsername, formatearCuil } from '../utils/validators';
import { colors } from '../theme/colors';

export default function RegisterStep1({ go, form, setForm }) {
  const { loginWithGoogle } = useAuth();
  const { region, setRegion, idioma, setIdioma, REGIONES, IDIOMAS } = useSettings();
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const estado = (valor, ok) => (!valor.trim() ? 'idle' : ok ? 'valid' : 'error');

  const nombreOk = validarNombre(form.nombre);
  const emailOk = validarEmail(form.email);
  const cuilOk = validarCuil(form.cuil);
  const userOk = validarUsername(form.username);
  const todoOk = nombreOk && emailOk && cuilOk && userOk;

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  return (
    <Screen nav={false}>
      <View style={s.top}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Creá tu cuenta</Text>
          <Text style={s.sub}>Reciclá tus botellas y generá valor digital.</Text>
        </View>
        <Avatar />
      </View>

      <Field label="Nombre completo" value={form.nombre} onChangeText={set('nombre')} autoCapitalize="words" placeholder="Juan Pérez"
        state={estado(form.nombre, nombreOk)} message={form.nombre.trim() ? (nombreOk ? 'Nombre válido' : 'Ingresá nombre y apellido') : null} />
      <Field label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" placeholder="tu@email.com"
        state={estado(form.email, emailOk)} message={form.email.trim() ? (emailOk ? 'Email válido' : 'Revisá el formato del email') : null} />
      <Field label="CUIL" value={form.cuil} onChangeText={(v) => set('cuil')(formatearCuil(v))} keyboardType="numeric" placeholder="20-12345678-6"
        state={estado(form.cuil, cuilOk)}
        message={form.cuil.trim() ? (cuilOk ? 'CUIL argentino válido. La identidad se validará con el servicio correspondiente.' : 'El CUIL no es válido') : null} />
      <Select label="Región" value={region} options={REGIONES} onChange={setRegion} valid message="Región seleccionada" />
      <Select label="Idioma" value={idioma} options={IDIOMAS} onChange={setIdioma} valid message="Idioma seleccionado" />
      <Field label="Nombre de usuario" value={form.username} onChangeText={set('username')} placeholder="Elegí un nombre único"
        state={estado(form.username, userOk)} message={form.username.trim() && !userOk ? 'Usá 3 a 20 caracteres: letras, números, . o _' : null} />

      <Button variant="green" title="Continuar" disabled={!todoOk} onPress={() => go('reg2')} />
      <Button variant="white" icon="logo-google" title="Continuar con Google" onPress={handleGoogle} />
      <TouchableOpacity onPress={() => go('welcome')}>
        <Text style={s.link}>← Volver</Text>
      </TouchableOpacity>

      <Image source={require('../../assets/banner.jpg')} style={s.banner} resizeMode="cover" />
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 15, color: colors.slate, marginTop: 2 },
  link: { textAlign: 'center', color: colors.navy, fontWeight: '700', marginTop: 4, marginBottom: 12 },
  banner: { height: 254, marginHorizontal: -20, marginBottom: -32 },
});