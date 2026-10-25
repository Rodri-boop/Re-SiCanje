import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SettingsProvider } from './src/context/SettingsContext';
import { AuthProvider } from './src/context/AuthContext';
import { WalletProvider } from './src/context/WalletContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WalletProvider>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </SafeAreaView>
        </WalletProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.bg } });