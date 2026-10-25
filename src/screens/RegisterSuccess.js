import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Screen from '../components/Screen';
import { Avatar } from '../components/Header';
import StepDots from '../components/StepDots';
import Card from '../components/Card';
import Button from '../components/Button';
import SettingsSection from '../components/SettingsSection';
import { colors } from '../theme/colors';

// OJO: este bono es solo visual. Para acreditarlo de verdad hay que hacerlo en el servidor.
const BONO_BIENVENIDA = 50;

export default function RegisterSuccess() {
  const { registroInfo, finalizarRegistro } = useAuth();
  const { nombre, username, needsConfirmation } = registroInfo;
  const primerNombre = nombre.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

  const Fila = ({ label, valor, color = colors.ink }) => (
    <View style={s.fila}>
      <Text style={s.filaLabel}>{label}</Text>
      <Text style={[s.filaValor, { color }]}>{valor}</Text>
    </View>
  );

  return (
    <Screen nav={false}>
      <View style={s.top}>
        <StepDots paso={3} />
        <Avatar />
      </View>

      <View style={s.circulo}>
        <Ionicons name="checkmark" size={80} color={colors.green} />
      </View>
      <Text style={s.title}>¡Registro exitoso!</Text>
      <Text style={s.sub}>
        {needsConfirmation
          ? 'Te enviamos un correo para confirmar tu cuenta. Confirmalo y después iniciá sesión.'
          : BONO_BIENVENIDA > 0
          ? `Ya podés empezar a reciclar. Te sumamos $ ${BONO_BIENVENIDA} de bienvenida.`
          : 'Ya podés empezar a reciclar.'}
      </Text>

      <Card style={{ padding: 20 }}>
        <Text style={s.cardHead}>DATOS DE TU CUENTA</Text>
        <Fila label="Usuario" valor={username} />
        <View style={s.sep} />
        <Fila label="Alias provisorio" valor={`recicanje.${primerNombre}`} color={colors.navy} />
        {BONO_BIENVENIDA > 0 && (
          <>
            <View style={s.sep} />
            <Fila label="Premio de bienvenida" valor={`+ $${BONO_BIENVENIDA}`} color={colors.green} />
          </>
        )}
      </Card>

      <Card style={s.paso}>
        <View style={s.num}><Text style={s.numTxt}>1</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.pasoTitle}>Tu primer canje</Text>
          <Text style={s.pasoTxt}>Escaneá una botella PET, identificála y acercate al Resi-Drop más cercano.</Text>
        </View>
      </Card>

      <SettingsSection title="AJUSTES DE REGIÓN E IDIOMA" tone="mint" />

      <Button variant="green" title={needsConfirmation ? 'Ir a iniciar sesión' : 'Comenzá a reciclar'} onPress={finalizarRegistro} />
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  circulo: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.mint, borderWidth: 2, borderColor: colors.green, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: colors.navy, textAlign: 'center' },
  sub: { fontSize: 16, color: colors.slate, textAlign: 'center', marginTop: 8, marginBottom: 24, lineHeight: 23 },
  cardHead: { fontSize: 14, fontWeight: '800', color: colors.slate, marginBottom: 12 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filaLabel: { fontSize: 16, color: colors.slate },
  filaValor: { fontSize: 16, fontWeight: '800' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  paso: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  num: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  numTxt: { color: colors.white, fontWeight: '800', fontSize: 16 },
  pasoTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  pasoTxt: { fontSize: 14, color: colors.slate, marginTop: 2, lineHeight: 20 },
});