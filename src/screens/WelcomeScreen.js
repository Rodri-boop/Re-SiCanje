import React from 'react';
import { View, Text, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Select from '../components/Select';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function WelcomeScreen({ go }) {
  const { loginWithGoogle } = useAuth();
  const { region, setRegion, idioma, setIdioma, REGIONES, IDIOMAS } = useSettings();

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (!res.ok) Alert.alert(res.title, res.message);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={s.scroll} bounces={false}>
      <Image source={require('../../assets/banner.jpg')} style={s.banner} resizeMode="cover" />

      <View style={s.card}>
        <Text style={s.cardTitle}>Configuración</Text>
        <Select soft label="Región" value={region} options={REGIONES} onChange={setRegion} />
        <Select soft label="Idioma" value={idioma} options={IDIOMAS} onChange={setIdioma} />
      </View>

      <View style={s.bottom}>
        <Button variant="google" icon="logo-google" title="Continuar con Google" onPress={handleGoogle} />
        <Button variant="white" title="Continuar con email" onPress={() => go('reg1')} />
        <Button variant="dark" title="Iniciá sesión" onPress={() => go('login')} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1 },
  banner: { width: '100%', height: 214 },
  card: { marginHorizontal: 24, marginTop: 6, backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 20, paddingBottom: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 14 },
  bottom: { flex: 1, justifyContent: 'flex-end', padding: 24, paddingTop: 32, paddingBottom: 40 },
});