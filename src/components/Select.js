import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function Select({ label, value, options, onChange, message, valid, soft }) {
  const [open, setOpen] = useState(false);
  const actual = options.find((o) => o.id === value);

  return (
    <View style={{ marginBottom: 14 }}>
      {!!label && <Text style={[s.label, soft && s.labelSoft]}>{label}</Text>}
      <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(true)} style={[s.box, soft && s.boxSoft, valid && s.boxValid]}>
        <Text style={s.value}>{actual?.nombre}</Text>
        {valid ? (
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.green} />
        ) : (
          <Ionicons name="chevron-down" size={20} color={colors.slate} />
        )}
      </TouchableOpacity>
      {!!message && <Text style={[s.msg, { color: valid ? colors.green : colors.slate }]}>{message}</Text>}

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={s.backdrop} onPress={() => setOpen(false)}>
          <View style={s.sheet}>
            {options.map((o) => (
              <TouchableOpacity key={o.id} style={s.opt} onPress={() => { onChange(o.id); setOpen(false); }}>
                <Text style={[s.optText, o.id === value && { color: colors.navy, fontWeight: '700' }]}>{o.nombre}</Text>
                {o.id === value && <Ionicons name="checkmark" size={20} color={colors.navy} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  labelSoft: { fontSize: 13, fontWeight: '600', color: colors.slate },
  box: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, height: 52 },
  boxSoft: { backgroundColor: '#F8FAFC' },
  boxValid: { borderColor: colors.green, borderWidth: 1.5 },
  value: { fontSize: 16, color: colors.ink },
  msg: { fontSize: 13, marginTop: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 32 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  optText: { fontSize: 16, color: colors.ink },
});