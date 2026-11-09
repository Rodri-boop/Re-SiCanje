import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function ScanResultScreen({ navigate }) {
  const { agregarCreditos } = useWallet();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    
    try {
      let creditosGanados = 30; 
      let nombrePunto = 'ReciDrop';

      try {
        const parsed = JSON.parse(data);
        if (parsed.creditos) creditosGanados = parseInt(parsed.creditos, 10);
        if (parsed.punto) nombrePunto = parsed.punto;
      } catch (e) {
        creditosGanados = 30; 
      }

      agregarCreditos(creditosGanados, 0.05, `Validación presencial en ${nombrePunto}`);

      Alert.alert(
        '¡Re-SiCréditos acreditados!',
        `El operador del ReciDrop validó tu entrega. Se acreditaron ${creditosGanados} Re-SiCréditos en tu cuenta.`,
        [{ text: 'Ver Billetera', onPress: () => navigate('wallet') }]
      );
    } catch (error) {
      Alert.alert('Error de Lectura', 'El código QR presentado no es válido para la red de Re-SiCanje.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>No hay acceso a la cámara. Por favor habilítalo en la configuración de tu teléfono.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Validación en ReciDrop</Text>
      
      <View style={styles.sloganCard}>
        <Text style={styles.sloganText}>
          Toma una foto de tus envases, presentalo en un ReciDrop y obtene tus Re-SiCréditos en el acto.
        </Text>
      </View>

      {scanning ? (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity 
            style={styles.cancelScanBtn} 
            onPress={() => setScanning(false)}
          >
            <Text style={styles.cancelScanText}>Cancelar Escaneo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionSection}>
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>Paso final de validación:</Text>
            <Text style={styles.instructionsText}>
              Una vez que el operador del ReciDrop pese y verifique tus envases, te mostrará un código QR en su pantalla. Presiona el botón para escanearlo y recibir tus créditos de inmediato.
            </Text>
          </View>

          <Button 
            title="Escanear QR del ReciDrop" 
            onPress={() => setScanning(true)} 
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Red de Puntos Habilitados</Text>
      <TouchableOpacity 
        style={styles.mapLinkBtn} 
        onPress={() => navigate('map')}
        activeOpacity={0.8}
      >
        <Text style={styles.mapLinkText}>Buscar ReciDrops cercanos en el mapa →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 110 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  permissionText: { fontSize: 14, color: colors.slate600, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: colors.dark, marginBottom: 12 },
  sloganCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  sloganText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
    lineHeight: 22,
    textAlign: 'center',
  },
  actionSection: {
    marginBottom: 24,
  },
  instructionsBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: { fontSize: 14, fontWeight: '800', color: colors.dark, marginBottom: 6 },
  instructionsText: { fontSize: 12, color: colors.slate500, lineHeight: 18, fontWeight: '500' },
  cameraContainer: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.dark,
    position: 'relative',
  },
  cancelScanBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelScanText: { color: colors.white, fontSize: 13, fontWeight: '800' },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: colors.slate700, 
    marginBottom: 12 
  },
  mapLinkBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  mapLinkText: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '800',
  },
});
