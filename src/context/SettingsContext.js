import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

export const REGIONES = [{ id: 'AR', nombre: 'Argentina' }];
export const IDIOMAS = [
  { id: 'es-AR', nombre: 'Español (Argentina)' },
  { id: 'en', nombre: 'Inglés' },
  { id: 'pt', nombre: 'Portugués' },
];

export function SettingsProvider({ children }) {
  const [region, setRegion] = useState('AR');
  const [idioma, setIdioma] = useState('es-AR');
  return (
    <SettingsContext.Provider value={{ region, setRegion, idioma, setIdioma, REGIONES, IDIOMAS }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);