import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// state: 'idle' | 'valid' | 'error'
export default function Field({ label, state = 'idle', message, secure, style, ...props }) {
  const [show, setShow] = useState(false);
  const borderColor = state === 'valid' ? colors.green : state === 'error' ? colors.danger : colors.border;
  const msgColor = state === 'error' ? colors.danger : state === 'valid' ? colors.green : colors.slate;

  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}
      <View style={[s.box, { borderColor, borderWidth: state === 'idle' ? 1 : 1.5 }]}>
        <TextInput
          style={s.input}
          placeholderTextColor={colors.slate}
          secureTextEntry={secure && !show}
          autoCapitalize="none"
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setShow((v) => !v)}>
            <Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.slate} />
          </TouchableOpacity>
        ) : state === 'valid' ? (
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.green} />
        ) : null}
      </View>
      {!!message && <Text style={[s.msg, { color: msgColor }]}>{message}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, height: 52 },
  input: { flex: 1, fontSize: 16, color: colors.ink },
  msg: { fontSize: 13, marginTop: 6 },
});