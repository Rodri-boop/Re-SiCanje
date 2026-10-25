import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Screen from '../components/Screen';
import { Avatar } from '../components/Header';
import StepDots from '../components/StepDots';
import Field from '../components/Field';
import Select from '../components/Select';
import Button from '../components/Button';
import { reglasPassword } from '../utils/validators';
import { colors } from '../theme/colors';

export default function RegisterStep2({ go, form, setForm }) {
  const { register } = useAuth();
  const { region, setRegion, idioma, setIdioma, REGIONES, IDIOMAS } = useSettings();
  const [terminos, setTerminos] = useState(false);
  const [busy, setBusy] = useState(false);

  const r = reglasPassword(form.password);
  const passOk = r.largo && r.mayusNumero && r.especial;
  const coincide = form.confirm.length > 0 && form.confirm === form.password;
  const puedeContinuar = passOk && coincide && terminos;

  const enviar = async () => {
    setBusy(true);
    const res = await register({ ...form, region, idioma });
    setBusy(false);
    if (!res.ok) {
      Alert.alert(res.title, res.message);
      if (res.title === 'Usuario existente') go('reg1');
    }
    // si sale bien, AppNavigator muestra la pantalla "Registro exitoso"
  };

  const Regla = ({ ok, texto }) => (
    <View style={s.regla}>
      <Ionicons name="checkmark" size={16} color={ok ? colors.green : colors.slate} />
      <Text style={[s.reglaTxt, { color: ok ? colors.green : colors.slate }]}>{texto}</Text>
    </View>
  );

  return (
    <Screen nav={false}>
      <View style={s.top}>
        <TouchableOpacity style={s.back} onPress={() => go('reg1')}>
          <Ionicons name="chevron-back" size={20} color={colors.navy} />
        </TouchableOpacity>
        <StepDots paso={2} />
        <Avatar />
      </View>

      <Text style={s.title}>Seguridad y billetera</Text>
      <Text style={s.sub}>Configurá tu clave, habilitá tu billetera para acreditaciones y retiros en pesos argentinos, y aceptá los términos para continuar.</Text>

      <View style={s.info}>
        <View style={s.infoHead}>
          <Ionicons name="wallet" size={22} color={colors.navy} />
          <Text style={s.infoTitle}>BILLETERA PARA PESOS ARGENTINOS</Text>
        </View>
        <Text style={s.infoText}>Esta billetera se usará para recibir acreditaciones en pesos argentinos por tus canjes. Podrás asociar una cuenta bancaria argentina mediante CVU, CBU o alias para retiros, sujeto a validación de identidad y conexión futura con un proveedor de pagos.</Text>
      </View>

      <Field label="Contraseña" secure value={form.password} onChangeText={(v) => setForm((p) => ({ ...p, password: v }))} placeholder="********" style={{ marginBottom: 8 }} />
      <View style={{ marginBottom: 14, paddingLeft: 4 }}>
        <Regla ok={r.largo} texto="Mínimo 8 caracteres" />
        <Regla ok={r.mayusNumero} texto="Contiene una mayúscula y un número" />
        <Regla ok={r.especial} texto="Contiene un carácter especial (@, $, !, etc.)" />
      </View>

      <Field label="Confirmar contraseña" secure value={form.confirm} onChangeText={(v) => setForm((p) => ({ ...p, confirm: v }))} placeholder="********"
        state={form.confirm ? (coincide ? 'valid' : 'error') : 'idle'}
        message={form.confirm ? (coincide ? 'La confirmación coincide' : 'Las contraseñas no coinciden') : null} />

      <Select label="Región" value={region} options={REGIONES} onChange={setRegion} message="Región base: Argentina" />
      <Select label="Idioma" value={idioma} options={IDIOMAS} onChange={setIdioma} message="Disponible: Español (Argentina), Inglés y Portugués" />

      <View style={s.datos}>
        <Ionicons name="shield-outline" size={22} color={colors.green} />
        <Text style={s.datosTxt}>Tratamiento de datos personales: Los datos que ingresás se tratarán conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina. Esta pantalla solicita consentimiento informado para continuar con la creación de tu cuenta y habilitar acreditaciones y retiros en pesos argentinos.</Text>
      </View>

      <TouchableOpacity style={s.check} onPress={() => setTerminos((t) => !t)} activeOpacity={0.8}>
        <View style={[s.box, terminos && { backgroundColor: colors.green, borderColor: colors.green }]}>
          {terminos && <Ionicons name="checkmark" size={18} color={colors.white} />}
        </View>
        <Text style={s.checkTxt}>Acepto los Términos de Servicio, la Política de Privacidad aplicable en Argentina y la habilitación de mi billetera para acreditaciones y retiros en pesos argentinos.</Text>
      </TouchableOpacity>

      <Button variant="green" title="Continuar con mi cuenta eco-activa" disabled={!puedeContinuar} loading={busy} onPress={enviar} />
      <Text style={s.foot}>Paso 2 de 3: Finalizá configurando tus credenciales de acceso y aceptando los términos para habilitar tu billetera.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 15, color: colors.slate, marginTop: 6, marginBottom: 18, lineHeight: 22 },
  info: { backgroundColor: colors.blueSoft, borderWidth: 1.5, borderColor: colors.navy, borderRadius: 20, padding: 16, marginBottom: 20 },
  infoHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: colors.navy, flexShrink: 1 },
  infoText: { fontSize: 14, color: colors.ink, lineHeight: 21 },
  regla: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  reglaTxt: { fontSize: 13 },
  datos: { flexDirection: 'row', gap: 10, backgroundColor: colors.mint, borderWidth: 1, borderColor: colors.green, borderRadius: 16, padding: 14, marginTop: 4, marginBottom: 16 },
  datosTxt: { flex: 1, fontSize: 13, fontWeight: '700', color: '#064E3B', lineHeight: 20 },
  check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 18 },
  box: { width: 26, height: 26, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  checkTxt: { flex: 1, fontSize: 14, color: colors.ink, lineHeight: 20 },
  foot: { fontSize: 13, color: colors.slate, textAlign: 'center', lineHeight: 19, marginTop: 4 },
});