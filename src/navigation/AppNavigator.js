import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme/colors';

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

// Pantallas que ocupan toda la pantalla sin mostrar la barra de navegación inferior
const SCREENS_WITHOUT_NAV = ['scan', 'scan_result', 'mp_transfer'];

export default function AppNavigator() {
  const { usuarioActivo, cargando } = useAuth();
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    if (!usuarioActivo) setScreen('home');
  }, [usuarioActivo]);

  // Pantalla de carga inicial elegante con temática de la app
  if (cargando) {
    return (
      <View style={[styles.container, styles.center, styles.splashContainer]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.splashBadge}>
          <Text style={styles.splashIcon}>♻️</Text>
        </View>
        <Text style={styles.splashTitle}>Re-SiCanje</Text>
        <Text style={styles.splashSubtitle}>Transformando tus reciclajes en valor</Text>
        <ActivityIndicator size="small" color={colors.white} style={{ marginTop: 24 }} />
      </View>
    );
  }

  // Si no hay sesión activa, mostramos la pantalla de autenticación
  if (!usuarioActivo) return <AuthScreen />;

  const CurrentScreenComponent = SCREENS[screen] || HomeScreen;
  const showNav = !SCREENS_WITHOUT_NAV.includes(screen);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Contenedor de pantalla con animación de aparición suave */}
      <Animated.View 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(150)} 
        style={[styles.screenContainer, showNav && styles.screenContainerWithNav]}
      >
        <CurrentScreenComponent navigate={setScreen} />
      </Animated.View>

      {/* Barra de navegación inferior flotante y moderna */}
      {showNav && <BottomNav current={screen} onNavigate={setScreen} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F8FAFC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContainer: {
    backgroundColor: colors.primary,
  },
  splashBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  splashIcon: {
    fontSize: 38,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  splashSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    fontWeight: '500',
  },
  screenContainer: {
    flex: 1,
  },
  screenContainerWithNav: {
    paddingBottom: 65, // Espacio reservado para que la BottomNav no tape el contenido de las pantallas
  },
});