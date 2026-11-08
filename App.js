import React from 'react';
import { SafeAreaView, View, Platform, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { WalletProvider } from './src/context/WalletContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

const SafeContainer = Platform.OS === 'web' ? View : SafeAreaView;

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <SafeContainer style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
          <AppNavigator />
        </SafeContainer>
      </WalletProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
});
