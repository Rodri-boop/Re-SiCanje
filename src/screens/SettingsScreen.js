import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { colors } from '../theme/colors';

export default function SettingsScreen({ navigate }) {
  const { usuarioActivo, resetPassword } = useAuth();
  const { region, idioma, setIdioma, REGIONES, IDIOMAS } = useSettings();
  const reg = REGIONES.find((r) => r.id === region);

  return (
    <Screen>
      <Header title="Configuración" onBack={() => navigate('profile')} />

      {/* Región */}
      <Text style={s.section}>Región</Text>
      <Card>
        <View style={[s.opt, s.rowSel]}>
          <Text style={s.rowText}>{reg.nombre}</Text>
          <Badge label="Seleccionada" variant="navy" />
        </View>
      </Card>

      {/* Idioma */}
      <Text style={s.section}>Idioma</Text>
      <Card>
        {IDIOMAS.map((i) => {
          const on = i.id === idioma;
          return (
            <TouchableOpacity key={i.id} onPress={() => setIdioma(i.id)} style={[s.opt, on ? s.rowSel : s.optOff]}>
              <Text style={s.rowText}>{i.nombre}</Text>
              {on ? (
                <Badge label="Seleccionado" variant="navy" />
              ) : (
                <Text style={s.disp}>Disponible</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* Cambiar contraseña */}
      <Text style={s.section}>Seguridad</Text>
      <Card>
        <TouchableOpacity
          style={s.menuRow}
          onPress={async () => {
            const res = await resetPassword(usuarioActivo?.email);
            if (res.ok) {
              Alert.alert('Enlace enviado', `Te enviamos un correo a ${usuarioActivo?.email} para cambiar tu contraseña. Revisá tu bandeja de entrada.`);
            } else {
              Alert.alert(res.title, res.message);
            }
          }}
          activeOpacity={0.7}
        >
          <View style={s.menuIcon}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.navy} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.menuTitle}>Cambiar contraseña</Text>
            <Text style={s.menuSub}>Actualizar tu contraseña de acceso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.slate} />
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 8, marginBottom: 12 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1 },
  rowSel: { backgroundColor: colors.soft, borderColor: colors.soft },
  optOff: { backgroundColor: colors.white, borderColor: colors.border },
  rowText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  disp: { fontSize: 13, fontWeight: '700', color: colors.slate },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  menuSub: { fontSize: 13, color: colors.slate, marginTop: 2 },
});

