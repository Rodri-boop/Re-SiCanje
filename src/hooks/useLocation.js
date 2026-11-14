import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

const DEFAULT_COORDS = { latitude: -34.6037, longitude: -58.3816 }; // Buenos Aires por defecto

export default function useLocation() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [texto, setTexto] = useState('Buenos Aires, Argentina (Por defecto)');
  const [cargando, setCargando] = useState(false);

  // Función para convertir lat/lon en nombre de ciudad legible
  const obtenerNombreCiudad = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
        headers: { 'User-Agent': 'ReSiCanjeApp/1.0' }
      });
      const data = await response.json();
      const address = data.address || {};
      const ciudad = address.city || address.town || address.village || address.county || address.state || 'Ubicación actual';
      const pais = address.country || '';
      return `${ciudad}, ${pais}`;
    } catch (e) {
      return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    }
  };

  const actualizar = useCallback(async () => {
    setCargando(true);

    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCoords({ latitude, longitude });
              const nombreLugar = await obtenerNombreCiudad(latitude, longitude);
              setTexto(`${nombreLugar} (GPS Web)`);
              setCargando(false);
              resolve({ ok: true, message: '¡Ubicación obtenida con éxito!' });
            },
            (error) => {
              console.warn('Error GPS Web:', error.message);
              setCargando(false);
              resolve({ ok: false, title: 'Permiso', message: 'Permití el acceso a tu ubicación en el navegador.' });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          setCargando(false);
          resolve({ ok: false, title: 'No compatible', message: 'Tu navegador no soporta geolocalización.' });
        }
      });
    } 
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCargando(false);
        return { ok: false, title: 'Permiso denegado', message: 'Necesitamos acceso a tu ubicación.' };
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });
      
      const nombreLugar = await obtenerNombreCiudad(latitude, longitude);
      setTexto(`${nombreLugar} (GPS Móvil)`);
      setCargando(false);

      return { ok: true, message: 'Ubicación actualizada con éxito.' };
    } catch (error) {
      console.warn('Error GPS:', error);
      setCoords(DEFAULT_COORDS);
      setTexto('Buenos Aires, Argentina (Simulado)');
      setCargando(false);
      return { ok: true, message: 'Usando ubicación de referencia.' };
    }
  }, []);

  useEffect(() => {
    actualizar();
  }, [actualizar]);

  return { coords, texto, cargando, actualizar };
}