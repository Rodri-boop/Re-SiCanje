import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'];

export default function ScanScreen({ navigate }) {
  const [permission, requestPermission] = useCameraPermissions();
  const { registerScan } = useWallet();
  const [torch, setTorch] = useState(false);
  const yaEscaneado = useRef(false); // evita que la cámara dispare varias veces seguidas

  const handleBarcode = ({ data }) => {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    registerScan(data);
    navigate('scan_result');
  };

  // 1) Todavía cargando el estado del permiso
  if (!permission) {
    return <View style={styles.container} />;
  }

  // 2) Sin permiso: explicamos y pedimos
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.permIcon}>📷</Text>
        <Text style={styles.permTitle}>Necesitamos acceso a la cámara</Text>
        <Text style={styles.permText}>
          Se usa solamente para escanear el código de tus envases reciclables.
        </Text>
        {permission.canAskAgain ? (
          <Button variant="green" title="Permitir cámara" onPress={requestPermission} />
        ) : (
          <Button variant="green" title="Abrir ajustes" onPress={() => Linking.openSettings()} />
        )}
        <TouchableOpacity onPress={() => navigate('home')}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3) Con permiso: cámara en vivo
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        onBarcodeScanned={handleBarcode}
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('home')}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Escanear Envase</Text>
        <TouchableOpacity onPress={() => setTorch((t) => !t)}>
          <Text style={styles.torch}>{torch ? '🔦 On' : '🔦 Off'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.instruction}>Apuntá al código de barras del envase</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 30,
    backgroundColor: 'rgba(15,23,42,0.55)',
  },
  back: { color: colors.white, fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  title: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  torch: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 280, height: 160, borderWidth: 3, borderColor: colors.green, borderRadius: 20 },
  instruction: {
    color: colors.white, fontSize: 13, marginTop: 16, paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 10, overflow: 'hidden',
  },
  permIcon: { fontSize: 48, marginBottom: 12 },
  permTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  permText: { color: colors.border, fontSize: 13, textAlign: 'center', marginBottom: 20 },
});