import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import MapScreen from '../screens/MapScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import OperatorScreen from '../screens/OperatorScreen';
import BottomNav from '../components/BottomNav';

export default function AppNavigator() {
  const { usuarioActivo, cargando } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (cargando) {
    return <View style={styles.container} />;
  }

  if (!usuarioActivo) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen navigate={setActiveTab} />;
      case 'wallet':
        return <WalletScreen navigate={setActiveTab} />;
      case 'map':
        return <MapScreen navigate={setActiveTab} />;
      case 'scan':
        return <ScanResultScreen navigate={setActiveTab} />;
      case 'operator':
        return <OperatorScreen navigate={setActiveTab} />;
      default:
        return <HomeScreen navigate={setActiveTab} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNav current={activeTab} onNavigate={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  content: {
    flex: 1,
  },
});
