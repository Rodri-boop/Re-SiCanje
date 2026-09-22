import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  Alert,
  ActivityIndicator 
} from 'react-native';

export default function App() {
  // --- NAVEGACIÓN Y PANTALLA ---
  const [currentScreen, setCurrentScreen] = useState('auth'); // 'auth' | 'home' | 'scan' | 'scan_result' | 'map' | 'wallet' | 'mp_transfer'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // --- BASE DE USUARIOS (Simulada en memoria) ---
  const [usuarios, setUsuarios] = useState([
    { nombre: 'Federico', email: 'demo@recicanje.com', password: '123' }
  ]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // --- FORMULARIOS AUTH ---
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // --- BILLETERA Y PUNTOS ---
  const [balance, setBalance] = useState(2450);
  const [recycledKg, setRecycledKg] = useState(15.4);
  const [cvu, setCvu] = useState('');
  const [titular, setTitular] = useState('');
  const [monto, setMonto] = useState('2450');

  // --- HISTORIAL DINÁMICO ---
  const [movimientos, setMovimientos] = useState([
    { id: '1', texto: '+ 12 Botellas PET depositadas', monto: '+$600 ARS', tipo: 'green' },
    { id: '2', texto: '+ 8 Latas de Aluminio', monto: '+$400 ARS', tipo: 'green' },
    { id: '3', texto: '- Retiro enviado a Mercado Pago', monto: '-$1.000 ARS', tipo: 'blue' }
  ]);

  // --- GPS ---
  const [ubicacionTexto, setUbicacionTexto] = useState('Lat: -34.6037, Lon: -58.3816 (Por defecto)');
  const [cargandoGPS, setCargandoGPS] = useState(false);

  // --- ACCIONES DE AUTENTICACIÓN ---
  const handleRegistro = () => {
    if (!regNombre.trim() || !regEmail.trim() || !regPass.trim() || !regPassConfirm.trim()) {
      Alert.alert('Datos incompletos', 'Completá todos los campos para continuar.');
      return;
    }

    if (regPass !== regPassConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const emailExiste = usuarios.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExiste) {
      Alert.alert('Usuario existente', 'Ya existe una cuenta registrada con este correo.');
      return;
    }

    const nuevoUsuario = {
      nombre: regNombre.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPass
    };

    setUsuarios(prev => [...prev, nuevoUsuario]);
    setUsuarioActivo(nuevoUsuario);

    // Limpiar campos de registro
    setRegNombre('');
    setRegEmail('');
    setRegPass('');
    setRegPassConfirm('');

    Alert.alert('¡Cuenta creada!', `Bienvenido a RECICANJE, ${nuevoUsuario.nombre}.`);
    setCurrentScreen('home');
  };

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPass.trim()) {
      Alert.alert('Datos incompletos', 'Ingresá tu correo y contraseña.');
      return;
    }

    const encontrado = usuarios.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPass
    );

    if (!encontrado) {
      Alert.alert('Error al ingresar', 'Correo o contraseña incorrectos.');
      return;
    }

    setUsuarioActivo(encontrado);
    setLoginPass('');
    setCurrentScreen('home');
  };

  const handleGoogleLogin = () => {
    const googleUser = { nombre: 'Usuario Google', email: 'google@recicanje.com' };
    setUsuarioActivo(googleUser);
    Alert.alert('Inicio con Google', '¡Sesión iniciada con éxito!');
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUsuarioActivo(null);
    setLoginPass('');
    setCurrentScreen('auth');
    setAuthMode('login');
  };

  // --- ACCIONES DE BILLETERA ---
  const handleTransferMP = () => {
    if (!cvu.trim() || !titular.trim()) {
      Alert.alert('Error', 'Ingresá el CVU/Alias y el Titular de Mercado Pago.');
      return;
    }
    const montoNum = parseInt(monto, 10) || 0;
    if (montoNum <= 0) {
      Alert.alert('Error', 'Ingresá un monto válido mayor a 0.');
      return;
    }
    if (montoNum > balance) {
      Alert.alert('Saldo insuficiente', 'El monto supera tu saldo disponible.');
      return;
    }

    setBalance(prev => prev - montoNum);
    setMovimientos(prev => [
      {
        id: Date.now().toString(),
        texto: `- Retiro enviado a ${titular}`,
        monto: `-$${montoNum.toLocaleString()} ARS`,
        tipo: 'blue'
      },
      ...prev
    ]);

    Alert.alert(
      'Mercado Pago', 
      `¡Transferencia de $${montoNum.toLocaleString()} ARS enviada!\nDestino: ${cvu}\nTitular: ${titular}`
    );
    setCurrentScreen('wallet');
  };

  // --- ACCIONES DE ESCANEO ---
  const handleSimulateScan = () => {
    const puntosGanados = 50;
    const kgGanados = 0.05;

    setBalance(prev => prev + puntosGanados);
    setRecycledKg(prev => +(prev + kgGanados).toFixed(2));

    setMovimientos(prev => [
      {
        id: Date.now().toString(),
        texto: '+ 1 Botella PET depositada',
        monto: `+$${puntosGanados} ARS`,
        tipo: 'green'
      },
      ...prev
    ]);

    setCurrentScreen('scan_result');
  };

  // --- GPS ---
  const handleActualizarGPS = () => {
    setCargandoGPS(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacionTexto(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Actualizado)`);
          setCargandoGPS(false);
          Alert.alert('GPS', 'Ubicación recalculada con éxito.');
        },
        () => {
          setUbicacionTexto('Lat: -34.6037, Lon: -58.3816 (Simulado)');
          setCargandoGPS(false);
          Alert.alert('GPS', 'Ubicación fijada por referencia.');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setUbicacionTexto('Lat: -34.6083, Lon: -58.3712 (Cercano a Resi-Drop)');
        setCargandoGPS(false);
        Alert.alert('GPS', 'Ubicación actualizada correctamente.');
      }, 600);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ========================================== */}
        {/* 1. AUTENTICACIÓN (LOGIN / REGISTRO)        */}
        {/* ========================================== */}
        {currentScreen === 'auth' && (
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>♻</Text>
            </View>
            <Text style={styles.appTitle}>RECICANJE</Text>
            <Text style={styles.subtitle}>Transformá tus reciclables en dinero y beneficios</Text>

            {/* Selector de modo */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabBtn, authMode === 'login' && styles.tabBtnActive]} 
                onPress={() => setAuthMode('login')}
              >
                <Text style={[styles.tabBtnText, authMode === 'login' && styles.tabBtnTextActive]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabBtn, authMode === 'register' && styles.tabBtnActive]} 
                onPress={() => setAuthMode('register')}
              >
                <Text style={[styles.tabBtnText, authMode === 'register' && styles.tabBtnTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORMULARIO LOGIN */}
            {authMode === 'login' && (
              <View style={styles.formContainer}>
                <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogleLogin}>
                  <Text style={styles.btnGoogleText}>🔴 Continuar con Google</Text>
                </TouchableOpacity>

                <Text style={styles.dividerText}>— o ingresá con tus datos —</Text>

                <TextInput 
                  placeholder="Correo electrónico" 
                  placeholderTextColor="#94A3B8" 
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input} 
                />
                <TextInput 
                  placeholder="Contraseña" 
                  placeholderTextColor="#94A3B8" 
                  value={loginPass}
                  onChangeText={setLoginPass}
                  secureTextEntry 
                  style={styles.input} 
                />

                <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
                  <Text style={styles.btnText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAuthMode('register')} style={{ marginTop: 10 }}>
                  <Text style={styles.linkSecondary}>¿No tenés cuenta? Registrate acá</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* FORMULARIO REGISTRO */}
            {authMode === 'register' && (
              <View style={styles.formContainer}>
                <TextInput 
                  placeholder="Nombre y Apellido" 
                  placeholderTextColor="#94A3B8" 
                  value={regNombre}
                  onChangeText={setRegNombre}
                  style={styles.input} 
                />
                <TextInput 
                  placeholder="Correo electrónico" 
                  placeholderTextColor="#94A3B8" 
                  value={regEmail}
                  onChangeText={setRegEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input} 
                />
                <TextInput 
                  placeholder="Crear Contraseña" 
                  placeholderTextColor="#94A3B8" 
                  value={regPass}
                  onChangeText={setRegPass}
                  secureTextEntry 
                  style={styles.input} 
                />
                <TextInput 
                  placeholder="Repetir Contraseña" 
                  placeholderTextColor="#94A3B8" 
                  value={regPassConfirm}
                  onChangeText={setRegPassConfirm}
                  secureTextEntry 
                  style={styles.input} 
                />

                <TouchableOpacity style={styles.btnGreen} onPress={handleRegistro}>
                  <Text style={styles.btnText}>Crear Cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAuthMode('login')} style={{ marginTop: 10 }}>
                  <Text style={styles.linkSecondary}>¿Ya tenés cuenta? Iniciá sesión</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* 2. INICIO / PANEL PRINCIPAL                */}
        {/* ========================================== */}
        {currentScreen === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerGreeting}>Hola, {usuarioActivo?.nombre || 'Ecologista'} 👋</Text>
                <Text style={styles.userEmailTag}>{usuarioActivo?.email}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutLink}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

            {/* Tarjeta Puntos */}
            <View style={[styles.card, { backgroundColor: '#1E56F0' }]}>
              <Text style={styles.cardLabel}>Balance de Puntos Ecológicos</Text>
              <Text style={styles.cardValue}>{balance.toLocaleString()} PTS</Text>
              <Text style={styles.cardSub}>≈ ${balance.toLocaleString()} ARS canjeables</Text>
            </View>

            {/* Tarjeta Impacto */}
            <View style={[styles.card, { backgroundColor: '#00C06D' }]}>
              <Text style={styles.cardLabel}>Impacto Positivo</Text>
              <Text style={styles.cardValue}>{recycledKg} Kg</Text>
              <Text style={styles.cardSub}>Plástico PET reciclado acumulado</Text>
            </View>

            <TouchableOpacity style={styles.btnGreen} onPress={() => setCurrentScreen('scan')}>
              <Text style={styles.btnText}>📷 Escanear Botella / Envase</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => setCurrentScreen('map')}>
              <Text style={styles.btnText}>📍 Puntos de Entrega Cercanos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMP} onPress={() => setCurrentScreen('mp_transfer')}>
              <Text style={styles.btnText}>💳 Retirar con Mercado Pago</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* 3. VISOR DE CÁMARA / ESCANEAR              */}
        {/* ========================================== */}
        {currentScreen === 'scan' && (
          <View style={styles.scanContainer}>
            <View style={styles.topBarDark}>
              <TouchableOpacity onPress={() => setCurrentScreen('home')}>
                <Text style={styles.topBarBack}>← Volver</Text>
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>Escanear Envase</Text>
              <View style={{ width: 60 }} />
            </View>

            <View style={styles.cameraBox}>
              <View style={styles.scanFrame}>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.cameraInstruction}>Centrá la botella PET dentro del recuadro</Text>
              </View>
            </View>

            <View style={styles.bottomCaptureBox}>
              <TouchableOpacity style={styles.btnGreen} onPress={handleSimulateScan}>
                <Text style={styles.btnText}>📸 Capturar y Analizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================== */}
        {/* 4. RESULTADO DE DETECCIÓN                  */}
        {/* ========================================== */}
        {currentScreen === 'scan_result' && (
          <View style={styles.resultContainer}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.resultTitle}>¡Envase Válido Detectado!</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoText}>Material: <Text style={styles.boldText}>Plástico PET (Tipo 1)</Text></Text>
              <Text style={styles.infoText}>Envase: <Text style={styles.boldText}>Botella 500ml</Text></Text>
              <Text style={styles.pointsEarned}>+50 Puntos Ecológicos ($50 ARS)</Text>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => setCurrentScreen('map')}>
              <Text style={styles.btnText}>Depositar en Punto de Entrega</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMP} onPress={() => setCurrentScreen('mp_transfer')}>
              <Text style={styles.btnText}>Canjear en Mercado Pago</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentScreen('scan')} style={{ marginTop: 10 }}>
              <Text style={styles.linkSecondary}>Escanear otro envase</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================== */}
        {/* 5. RESI-DROPS / MAPA                       */}
        {/* ========================================== */}
        {currentScreen === 'map' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <Text style={styles.headerGreeting}>Puntos de Entrega</Text>

            <View style={styles.gpsBanner}>
              <Text style={styles.gpsTitle}>📍 Tu Ubicación GPS</Text>
              <Text style={styles.gpsSub}>{ubicacionTexto}</Text>
            </View>

            <Text style={styles.sectionHeader}>Centros Habilitados:</Text>

            <View style={styles.dropCard}>
              <Text style={styles.dropName}>🟢 Punto Central</Text>
              <Text style={styles.dropDist}>A 250 metros • Abierto 24 hs</Text>
              <Text style={styles.dropInfo}>Acepta: Botellas PET, Tapitas y Latas</Text>
            </View>

            <View style={styles.dropCard}>
              <Text style={styles.dropName}>🟢 Estación Plaza Verde</Text>
              <Text style={styles.dropDist}>A 800 metros • Hasta las 20:00 hs</Text>
              <Text style={styles.dropInfo}>Acepta: Plásticos y Cartón</Text>
            </View>

            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={handleActualizarGPS}
              disabled={cargandoGPS}
            >
              {cargandoGPS ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnText}>🎯 Recalcular mi ubicación</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* 6. BILLETERA                               */}
        {/* ========================================== */}
        {currentScreen === 'wallet' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <Text style={styles.headerGreeting}>Billetera de Créditos</Text>

            <View style={[styles.card, { backgroundColor: '#0F172A' }]}>
              <Text style={styles.cardLabel}>Saldo Canjeable</Text>
              <Text style={[styles.cardValue, { color: '#10B981' }]}>${balance.toLocaleString()} ARS</Text>
              <Text style={styles.cardSub}>Equivalente a {balance.toLocaleString()} Puntos Ecológicos</Text>
            </View>

            <TouchableOpacity style={styles.btnMP} onPress={() => setCurrentScreen('mp_transfer')}>
              <Text style={styles.btnText}>Retirar a Mercado Pago</Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeader}>Últimos Movimientos:</Text>

            <View style={styles.movementCard}>
              {movimientos.map((m, index) => (
                <React.Fragment key={m.id}>
                  <View style={styles.movRow}>
                    <Text style={m.tipo === 'green' ? styles.moveGreen : styles.moveBlue}>{m.texto}</Text>
                    <Text style={[styles.boldText, { color: m.tipo === 'green' ? '#16A34A' : '#0284C7' }]}>{m.monto}</Text>
                  </View>
                  {index < movimientos.length - 1 && <View style={styles.sep} />}
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* 7. RETIRO MERCADO PAGO                     */}
        {/* ========================================== */}
        {currentScreen === 'mp_transfer' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <TouchableOpacity onPress={() => setCurrentScreen('wallet')}>
              <Text style={{ color: '#009EE3', fontWeight: 'bold', marginBottom: 12 }}>← Volver</Text>
            </TouchableOpacity>

            <Text style={[styles.headerGreeting, { color: '#009EE3' }]}>Mercado Pago</Text>

            <View style={styles.mpBanner}>
              <Text style={styles.mpBannerLabel}>Monto disponible para transferir:</Text>
              <Text style={styles.mpBannerValue}>${balance.toLocaleString()} ARS</Text>
            </View>

            <Text style={styles.inputLabel}>CVU o Alias de Mercado Pago:</Text>
            <TextInput 
              placeholder="Ej: usuario.mp" 
              placeholderTextColor="#94A3B8" 
              value={cvu} 
              onChangeText={setCvu} 
              autoCapitalize="none"
              style={styles.input} 
            />

            <Text style={styles.inputLabel}>Titular de la cuenta:</Text>
            <TextInput 
              placeholder="Nombre y Apellido" 
              placeholderTextColor="#94A3B8" 
              value={titular} 
              onChangeText={setTitular} 
              style={styles.input} 
            />

            <Text style={styles.inputLabel}>Monto a transferir (ARS):</Text>
            <TextInput 
              value={monto} 
              onChangeText={setMonto} 
              keyboardType="numeric" 
              style={styles.input} 
            />

            <TouchableOpacity style={styles.btnMP} onPress={handleTransferMP}>
              <Text style={styles.btnText}>Confirmar Transferencia</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ========================================== */}
        {/* BARRA INFERIOR                             */}
        {/* ========================================== */}
        {currentScreen !== 'auth' && currentScreen !== 'scan' && (
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('home')}>
              <Text style={currentScreen === 'home' ? styles.navActive : styles.navInactive}>🏠</Text>
              <Text style={currentScreen === 'home' ? styles.navActiveText : styles.navInactiveText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('scan')}>
              <Text style={currentScreen === 'scan' ? styles.navActive : styles.navInactive}>📷</Text>
              <Text style={currentScreen === 'scan' ? styles.navActiveText : styles.navInactiveText}>Escanear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('map')}>
              <Text style={currentScreen === 'map' ? styles.navActive : styles.navInactive}>📍</Text>
              <Text style={currentScreen === 'map' ? styles.navActiveText : styles.navInactiveText}>Puntos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('wallet')}>
              <Text style={currentScreen === 'wallet' ? styles.navActive : styles.navInactive}>💳</Text>
              <Text style={currentScreen === 'wallet' ? styles.navActiveText : styles.navInactiveText}>Billetera</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  scrollPadding: { padding: 20, paddingBottom: 90 },

  // Auth & Pestañas
  authScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoIcon: { fontSize: 34, color: '#00C06D' },
  appTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', width: '100%', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#FFFFFF' },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabBtnTextActive: { color: '#0F172A', fontWeight: 'bold' },
  formContainer: { width: '100%', alignItems: 'center' },
  dividerText: { fontSize: 12, color: '#94A3B8', marginVertical: 12 },

  // Entradas
  input: { width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 14, color: '#0F172A', marginBottom: 10 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#334155', marginBottom: 6 },

  // Botones
  btnPrimary: { width: '100%', backgroundColor: '#1E56F0', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  btnGreen: { width: '100%', backgroundColor: '#00C06D', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  btnMP: { width: '100%', backgroundColor: '#009EE3', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  btnGoogle: { width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnGoogleText: { color: '#1E293B', fontWeight: 'bold', fontSize: 14 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  linkSecondary: { color: '#1E56F0', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // Encabezados
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerGreeting: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  userEmailTag: { fontSize: 12, color: '#64748B' },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutLink: { fontSize: 12, color: '#DC2626', fontWeight: 'bold' },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#334155', marginTop: 15, marginBottom: 10 },

  // Tarjetas
  card: { padding: 18, borderRadius: 16, marginBottom: 12 },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  cardValue: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginVertical: 4 },
  cardSub: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  // Cámara / Escaneo
  scanContainer: { flex: 1, backgroundColor: '#0F172A' },
  topBarDark: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 30 },
  topBarBack: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  topBarTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  cameraBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 350, borderWidth: 3, borderColor: '#00C06D', borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.4)' },
  cameraIcon: { fontSize: 44, marginBottom: 10 },
  cameraInstruction: { color: '#E2E8F0', fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  bottomCaptureBox: { padding: 20, paddingBottom: 30 },

  // Resultado
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  checkCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  checkIcon: { fontSize: 34, color: '#00C06D', fontWeight: 'bold' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  infoCard: { width: '100%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 18 },
  infoText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  boldText: { fontWeight: 'bold', color: '#0F172A' },
  pointsEarned: { fontSize: 16, fontWeight: 'bold', color: '#00C06D', marginTop: 8 },

  // Mapa
  gpsBanner: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 14, borderRadius: 12, marginBottom: 15 },
  gpsTitle: { fontWeight: 'bold', color: '#1E40AF', fontSize: 14 },
  gpsSub: { color: '#3B82F6', fontSize: 12, marginTop: 2 },
  dropCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, borderRadius: 12, marginBottom: 10 },
  dropName: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  dropDist: { fontSize: 12, color: '#00C06D', fontWeight: 'bold', marginVertical: 3 },
  dropInfo: { fontSize: 12, color: '#64748B' },

  // Billetera & Movimientos
  movementCard: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 15 },
  movRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moveGreen: { fontSize: 12, color: '#16A34A', fontWeight: '500', flex: 1 },
  moveBlue: { fontSize: 12, color: '#0284C7', fontWeight: '500', flex: 1 },
  sep: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  mpBanner: { backgroundColor: '#E0F2FE', padding: 14, borderRadius: 12, marginBottom: 15 },
  mpBannerLabel: { fontSize: 12, color: '#0369A1' },
  mpBannerValue: { fontSize: 24, fontWeight: 'bold', color: '#0284C7', marginTop: 2 },

  // Barra de Navegación Inferior
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navActive: { fontSize: 18, color: '#1E56F0' },
  navInactive: { fontSize: 18, color: '#94A3B8' },
  navActiveText: { fontSize: 11, fontWeight: 'bold', color: '#1E56F0', marginTop: 2 },
  navInactiveText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
});
