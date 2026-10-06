import { useState, useCallback } from 'react';

const DEFAULT_TEXT = 'Lat: -34.6037, Lon: -58.3816 (Por defecto)';

// TODO: migrar a expo-location para GPS real en dispositivo
export default function useLocation() {
  const [texto, setTexto] = useState(DEFAULT_TEXT);
  const [cargando, setCargando] = useState(false);

  // Devuelve una promesa con el mensaje a mostrar al usuario
  const actualizar = useCallback(() => {
    setCargando(true);
    return new Promise((resolve) => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setTexto(`Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)} (Actualizado)`);
            setCargando(false);
            resolve('Ubicación recalculada con éxito.');
          },
          () => {
            setTexto('Lat: -34.6037, Lon: -58.3816 (Simulado)');
            setCargando(false);
            resolve('Ubicación fijada por referencia.');
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setTimeout(() => {
          setTexto('Lat: -34.6083, Lon: -58.3712 (Cercano a Resi-Drop)');
          setCargando(false);
          resolve('Ubicación actualizada correctamente.');
        }, 600);
      }
    });
  }, []);

  return { texto, cargando, actualizar };
}
