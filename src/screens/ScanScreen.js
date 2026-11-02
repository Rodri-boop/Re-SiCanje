import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const BARCODE_TYPES = ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e'];

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
          Se usa para escanear el código QR del material reciclable y registrar su peso.
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

      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigate('home')}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Escanear QR de Reciclaje</Text>
        <TouchableOpacity onPress={() => setTorch((t) => !t)}>
          <Text style={styles.torch}>{torch ? '🔦 On' : '🔦 Off'}</Text>
        </TouchableOpacity>
      </View>

      {/* Capa con el marco posicionado en el centro ergonómico (más abajo) */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.scannerWrapper}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.instruction}>Apuntá al código QR del material</Text>
          <Text style={styles.subInstruction}>Identifica peso y triángulo de Möbius (PET a PS)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 36,
    backgroundColor: 'rgba(15,23,42,0.65)', zIndex: 10,
  },
  back: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
  title: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  torch: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerWrapper: {
    alignItems: 'center',
    transform: [{ translateY: 85 }], // Baja el recuadro 85px para situarlo en el centro natural
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(16,185,129,0.4)',
    borderRadius: 24,
    backgroundColor: 'rgba(16,185,129,0.06)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: colors.green,
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 24 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 24 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 24 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 24 },
  instruction: {
    color: colors.white, fontSize: 14, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: 12, overflow: 'hidden', marginTop: 18,
  },
  subInstruction: {
    color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6, textAlign: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, overflow: 'hidden',
  },
  permIcon: { fontSize: 48, marginBottom: 12 },
  permTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  permText: { color: colors.border, fontSize: 13, textAlign: 'center', marginBottom: 20 },
});
