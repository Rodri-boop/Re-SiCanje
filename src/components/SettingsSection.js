import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import Card from './Card';
import Badge from './Badge';
import { colors } from '../theme/colors';

export default function SettingsSection({ variant = 'rows', title = 'Configuración', tone = 'navy' }) {
  const { region, idioma, setIdioma, REGIONES, IDIOMAS } = useSettings();
  const reg = REGIONES.find((r) => r.id === region);
  const sel = IDIOMAS.find((i) => i.id === idioma);

  // Resultado del escaneo
  if (variant === 'chips') {
    const Fila = ({ label, valor }) => (
      <View style={s.between}>
        <Text style={s.muted}>{label}</Text>
        <View style={s.chip}>
          <Text style={s.chipText}>{valor}</Text>
          <Ionicons name="checkmark" size={16} color={colors.navy} />
        </View>
      </View>
    );
    return (
      <Card>
        <Text style={s.cardTitle}>{title}</Text>
        <Fila label="Región" valor={reg.nombre} />
        <View style={s.sep} />
        <Fila label="Idioma" valor={sel.nombre} />
      </Card>
    );
  }

  // Billetera
  if (variant === 'check') {
    return (
      <>
        <Text style={s.section}>{title}</Text>
        <Card>
          <Text style={s.group}>Región</Text>
          <View style={[s.opt, s.optOn]}>
            <Text style={s.optOnText}>{reg.nombre}</Text>
            <Ionicons name="checkmark" size={20} color={colors.navy} />
          </View>
        </Card>
        <Card>
          <Text style={s.group}>Idioma</Text>
          {IDIOMAS.map((i) => {
            const on = i.id === idioma;
            return (
              <TouchableOpacity key={i.id} onPress={() => setIdioma(i.id)} style={[s.opt, on ? s.optOn : s.optOff]}>
                <Text style={on ? s.optOnText : s.optOffText}>{i.nombre}</Text>
                <Ionicons name={on ? 'checkmark' : 'ellipse-outline'} size={20} color={on ? colors.navy : colors.slate400} />
              </TouchableOpacity>
            );
          })}
        </Card>
      </>
    );
  }

  // Inicio, Resi-Drops, detalle y registro exitoso
  const mint = tone === 'mint';
  return (
    <>
      <Text style={s.section}>{title}</Text>
      <Card>
        <Text style={s.cardTitle}>Región</Text>
        <View style={[s.opt, s.rowSel]}>
          <Text style={s.rowText}>{reg.nombre}</Text>
          <Badge label={mint ? 'Seleccionada' : 'Seleccionado'} variant={mint ? 'mintLine' : 'navy'} />
        </View>
      </Card>
      <Card>
        <Text style={s.cardTitle}>Idioma</Text>
        {IDIOMAS.map((i) => {
          const on = i.id === idioma;
          return (
            <TouchableOpacity key={i.id} onPress={() => setIdioma(i.id)} style={[s.opt, on ? s.rowSel : s.optOff]}>
              <Text style={s.rowText}>{i.nombre}</Text>
              {on ? (
                <Badge label="Seleccionado" variant={mint ? 'mintLine' : 'navy'} />
              ) : mint ? (
                <Badge label="Disponible" variant="ghost" />
              ) : (
                <Text style={s.disp}>Disponible</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </Card>
    </>
  );
}

const s = StyleSheet.create({
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 12 },
  group: { fontSize: 14, fontWeight: '600', color: colors.slate, marginBottom: 10 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { fontSize: 15, color: colors.slate },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blueSoft, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  chipText: { color: colors.navy, fontWeight: '700', fontSize: 14 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1 },
  optOn: { backgroundColor: colors.blueSoft, borderColor: colors.blueSoft },
  optOff: { backgroundColor: colors.white, borderColor: colors.border },
  optOnText: { fontSize: 16, fontWeight: '700', color: colors.navy },
  optOffText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  rowSel: { backgroundColor: colors.soft, borderColor: colors.soft },
  rowText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  disp: { fontSize: 13, fontWeight: '700', color: colors.slate },
});