import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StepDots({ paso, total = 3 }) {
  return (
    <View style={s.row}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const hecho = n < paso;
        const actual = n === paso;
        return (
          <View
            key={n}
            style={[s.dot, hecho && { backgroundColor: colors.green }, actual && s.actual, !hecho && !actual && { backgroundColor: colors.border }]}
          />
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  actual: { width: 30, backgroundColor: colors.navy },
});