import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import MapScreen from '../screens/MapScreen';
import WalletScreen from '../screens/WalletScreen';
import MPTransferScreen from '../screens/MPTransferScreen';

const SCREENS = {
  home: HomeScreen,
  scan: ScanScreen,
  scan_result: ScanResultScreen,
  map: MapScreen,
  wallet: WalletScreen,
  mp_transfer: MPTransferScreen,
};

const SCREENS_WITHOUT_NAV = ['scan'];

export default function AppNavigator() {
  const { usuarioActivo, cargando } = useAuth();
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    if (!usuarioActivo) setScreen('home');
  }, [usuarioActivo]);

  if (cargando) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00C06D" />
      </View>
    );
  }

  if (!usuarioActivo) return <AuthScreen />;

  const Screen = SCREENS[screen];
  return (
    <View style={styles.container}>
      <Screen navigate={setScreen} />
      {!SCREENS_WITHOUT_NAV.includes(screen) && <BottomNav current={screen} onNavigate={setScreen} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
});