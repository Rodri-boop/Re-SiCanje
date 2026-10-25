import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

import AuthNavigator from './AuthNavigator';
import RegisterSuccess from '../screens/RegisterSuccess';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import MapScreen from '../screens/MapScreen';
import DropDetailScreen from '../screens/DropDetailScreen';
import WalletScreen from '../screens/WalletScreen';
import MPTransferScreen from '../screens/MPTransferScreen';

const SCREENS = {
  home: HomeScreen,
  scan: ScanScreen,
  scan_result: ScanResultScreen,
  map: MapScreen,
  drop_detail: DropDetailScreen,
  wallet: WalletScreen,
  mp_transfer: MPTransferScreen,
};

// Qué pestaña de la barra inferior se ilumina en cada pantalla
const TAB = { home: 'home', scan: 'scan', scan_result: 'scan', map: 'map', drop_detail: 'map', wallet: 'wallet', mp_transfer: 'wallet' };

export default function AppNavigator() {
  const { usuarioActivo, cargando, registroInfo } = useAuth();
  const [route, setRoute] = useState({ name: 'home' });
  const navigate = (name, params) => setRoute({ name, params });

  useEffect(() => {
    if (!usuarioActivo) setRoute({ name: 'home' });
  }, [usuarioActivo]);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  if (registroInfo) return <RegisterSuccess />;
  if (!usuarioActivo) return <AuthNavigator />;

  const Screen = SCREENS[route.name];
  return (
    <View style={{ flex: 1 }}>
      <Screen navigate={navigate} params={route.params} />
      {route.name !== 'scan' && <BottomNav current={TAB[route.name]} onNavigate={navigate} />}
    </View>
  );
}