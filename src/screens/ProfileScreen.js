import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function ProfileScreen({ navigate }) {
  const { usuarioActivo, logout } = useAuth();

  return (
    <Screen>
      <Header title="Mi perfil" onBack={() => navigate('home')} />

      {/* Avatar + datos */}
      <View style={s.profileBox}>
        <Image source={require('../../assets/logo.png')} style={s.avatar} />
        <Text style={s.name}>{usuarioActivo?.nombre || 'Usuario'}</Text>
        <Text style={s.email}>{usuarioActivo?.email || 'sin correo'}</Text>
      </View>

      {/* Opciones */}
      <Text style={s.section}>Cuenta</Text>

      <Card>
        <TouchableOpacity style={s.menuRow} onPress={() => navigate('settings')} activeOpacity={0.7}>
          <View style={[s.menuIcon, { backgroundColor: colors.blueSoft }]}>
            <Ionicons name="settings-outline" size={22} color={colors.navy} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.menuTitle}>Configuración</Text>
            <Text style={s.menuSub}>Región, idioma y seguridad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.slate} />
        </TouchableOpacity>
      </Card>

      <View style={{ marginTop: 24 }}>
        <Button variant="outline" title="Cerrar sesión" icon="log-out-outline" onPress={logout} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  profileBox: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 14, borderWidth: 3, borderColor: colors.border },
  name: { fontSize: 24, fontWeight: '800', color: colors.ink },
  email: { fontSize: 15, color: colors.slate, marginTop: 4 },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 8, marginBottom: 12 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  menuSub: { fontSize: 13, color: colors.slate, marginTop: 2 },
});

