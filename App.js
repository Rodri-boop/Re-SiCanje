 import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { WalletProvider } from './src/context/WalletContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <SafeAreaView style={styles.safeArea}>
          <AppNavigator />
        </SafeAreaView>
      </WalletProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
});
