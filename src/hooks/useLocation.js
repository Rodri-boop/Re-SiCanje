import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [ubicacion, setUbicacion] = useState(null);
  const [texto, setTexto] = useState('Ubicación predeterminada: Pilar, Buenos Aires');
  const [cargando, setCargando] = useState(false);

  const actualizar = useCallback(async () => {
    setCargando(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCargando(false);
        return { ok: false, message: 'Permiso de ubicación denegado. Mostrando zona predeterminada en Pilar.' };
      }

      let location = await Location.getCurrentPositionAsync({});
      setUbicacion(location.coords);

      // Intentar obtener geocodificación inversa para mostrar ciudad/partido
      try {
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          const ciudad = place.city || place.subregion || place.district || 'Pilar';
          const region = place.region || 'Buenos Aires';
          setTexto(`Ubicación GPS: ${ciudad}, ${region}`);
        } else {
          setTexto(`Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`);
        }
      } catch (e) {
        setTexto('Pilar, Buenos Aires (GPS Activo)');
      }

      setCargando(false);
      return { ok: true, message: 'Ubicación actualizada correctamente.' };
    } catch (error) {
      setCargando(false);
      return { ok: false, message: 'No se pudo obtener la ubicación actual. Usando zona Pilar.' };
    }
  }, []);

  useEffect(() => {
    actualizar();
  }, [actualizar]);

  return { ubicacion, texto, cargando, actualizar };
}
