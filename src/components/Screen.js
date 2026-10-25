import React from 'react';
import { ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export default function Screen({ children, nav = true, style }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[{ padding: 20, paddingBottom: nav ? 100 : 32 }, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}