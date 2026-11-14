import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'];

export default function ScanScreen({ navigate }) {
  const [permission, requestPermission] = useCameraPermissions();
  const { registerScan } = useWallet();
  const [torch, setTorch] = useState(false);
  const yaEscaneado = useRef(false);

  const handleBarcode = ({ data }) => {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    registerScan(1); // Registra 1 envase por defecto al detectar el código
    navigate('scan_result');
  };

  // 1) Cargando permisos
  if (!permission) {
    return <View style={[styles.container, styles.center]}><StatusBar barStyle="light-content" /></View>;
  }

  // 2) Sin permisos de cámara
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center, { padding: 24 }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.permCard}>
          <Text style={styles.permIcon}>📷</Text>
          <Text style={styles.permTitle}>Permiso de Cámara Requerido</Text>
          <Text style={styles.permText}>
            Necesitamos acceder a tu cámara para escanear los códigos de barras de tus envases reciclables y otorgarte puntos.
          </Text>
          {permission.canAskAgain ? (
            <Button variant="green" title="Permitir acceso a la cámara" onPress={requestPermission} />
          ) : (
            <Button variant="green" title="Abrir ajustes del sistema" onPress={() => Linking.openSettings()} />
          )}
          <TouchableOpacity onPress={() => navigate('home')} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3) Con permisos: Cámara en vivo
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        onBarcodeScanned={handleBarcode}
      />

      {/* Barra superior flotante */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('home')} style={styles.topBtn} activeOpacity={0.7}>
          <Text style={styles.topBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Escanear Envase</Text>
        <TouchableOpacity onPress={() => setTorch((t) => !t)} style={styles.topBtn} activeOpacity={0.7}>
          <Text style={styles.topBtnText}>{torch ? '🔦 Linterna Encendida' : '🔦 Linterna Apagada'}</Text>
        </TouchableOpacity>
      </View>

      {/* Marco de enfoque central */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frameContainer}>
          <View style={styles.frame} />
        </View>
        <View style={styles.instructionBadge}>
          <Text style={styles.instruction}>Apuntá al código de barras del envase</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  center: { justifyContent: 'center', alignItems: 'center' },
  topBar: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'rgba(15,23,42,0.75)',
  },
  topBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  topBtnText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  title: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  frameContainer: {
    width: 280,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: '#10B981',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionBadge: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  instruction: {
    color: colors.white, 
    fontSize: 13, 
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  permCard: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  permIcon: { fontSize: 44, marginBottom: 12 },
  permTitle: { color: colors.dark, fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  permText: { color: colors.slate500, fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  backLink: { marginTop: 16 },
  backLinkText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
});