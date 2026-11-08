import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { colors, radii, shadows } from '../theme/colors';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'];

export default function ScanScreen({ navigate }) {
  const [permission, requestPermission] = useCameraPermissions();
  const { registerScan } = useWallet();
  const [torch, setTorch] = useState(false);
  const yaEscaneado = useRef(false);

  const handleBarcode = ({ data }) => {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    registerScan(data);
    navigate('scan_result');
  };

  const handleSimulate = () => {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    registerScan('7791234567890 (PET 500ml)');
    navigate('scan_result');
  };

  // 1) Cargando estado del permiso
  if (!permission) {
    return <View style={styles.container} />;
  }

  // 2) Sin permiso: interfaz explicativa amigable
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
        <View style={styles.permCircle}>
          <Icon name="camera" size={42} color={colors.primary} />
        </View>
        <Text style={styles.permTitle}>Permiso de Cámara Requerido</Text>
        <Text style={styles.permText}>
          Re-SiCanje utiliza la cámara únicamente para leer los códigos de barra y QR
          de las botellas de plástico y acreditar tus puntos ecológicos.
        </Text>

        {permission.canAskAgain ? (
          <Button
            title="Conceder permiso de cámara"
            icon="camera"
            onPress={requestPermission}
            style={styles.permBtn}
          />
        ) : (
          <Button
            title="Abrir ajustes del dispositivo"
            onPress={() => Linking.openSettings()}
            style={styles.permBtn}
          />
        )}

        {/* Botón alternativo de prueba */}
        <Button
          variant="outline"
          title="Simular escaneo (Modo Demo)"
          icon="sparkle"
          onPress={handleSimulate}
          style={styles.permBtnOutline}
        />

        <TouchableOpacity
          onPress={() => navigate('home')}
          style={styles.backLink}
          activeOpacity={0.7}
        >
          <Text style={styles.backLinkText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3) Con permiso de cámara
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

      {/* Top Bar translúcida */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigate('home')}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Icon name="arrowLeft" size={16} color={colors.white} />
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>Escanear Envase</Text>

        <TouchableOpacity
          onPress={() => setTorch((t) => !t)}
          style={[styles.torchBtn, torch && styles.torchBtnActive]}
          activeOpacity={0.7}
        >
          <Icon name="flash" size={14} color={torch ? colors.amber : colors.white} />
          <Text style={[styles.torchText, torch && styles.torchTextActive]}>
            {torch ? 'Luz ON' : 'Flash'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overlay de encuadre profesional centrado */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.viewfinder}>
          {/* Esquinas guía */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Línea simulada de escáner */}
          <View style={styles.laserLine} />
        </View>

        <View style={styles.instructionBadge}>
          <Text style={styles.instructionText}>
            Apuntá al código de barras o QR de tu botella
          </Text>
        </View>

        {/* Botón flotante para simular escaneo en pruebas */}
        <TouchableOpacity
          style={styles.simScanBtn}
          activeOpacity={0.85}
          onPress={handleSimulate}
        >
          <Icon name="sparkle" size={15} color={colors.white} />
          <Text style={styles.simScanText}>Simular lectura de botella PET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  permCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  permText: {
    color: colors.slate300,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  permBtn: {
    width: '100%',
    marginBottom: 10,
  },
  permBtnOutline: {
    width: '100%',
    marginBottom: 16,
  },
  backLink: {
    padding: 8,
  },
  backLinkText: {
    color: colors.slate400,
    fontSize: 13,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  topTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  torchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  torchBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: colors.amber,
  },
  torchText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  torchTextActive: {
    color: colors.amber,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  viewfinder: {
    width: 270,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors.greenLight,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 16,
  },
  laserLine: {
    width: '90%',
    height: 2,
    backgroundColor: colors.greenLight,
    shadowColor: colors.greenLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  instructionBadge: {
    marginTop: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  instructionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  simScanBtn: {
    position: 'absolute',
    bottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(5, 150, 105, 0.92)',
    borderWidth: 1.5,
    borderColor: colors.greenLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.full,
    ...shadows.card,
  },
  simScanText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});