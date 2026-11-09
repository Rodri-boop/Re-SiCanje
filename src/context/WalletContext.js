import React, { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(350);
  const [recycledKg, setRecycledKg] = useState(4.2);
  const [movimientos, setMovimientos] = useState([
    { id: '1', texto: 'Acreditación presencial en ReciDrop UNPilar', monto: '+100 CRÉDITOS', tipo: 'green' },
    { id: '2', texto: 'Canje de beneficio en comercio adherido', monto: '-50 CRÉDITOS', tipo: 'blue' },
    { id: '3', texto: 'Acreditación presencial en ReciDrop Plaza', monto: '+150 CRÉDITOS', tipo: 'green' },
  ]);

  const agregarCreditos = useCallback((cantidad, kilosExtra, descripcion) => {
    setBalance((prev) => prev + cantidad);
    setRecycledKg((prev) => parseFloat((prev + kilosExtra).toFixed(2)));
    
    const nuevoMovimiento = {
      id: Date.now().toString(),
      texto: descripcion || 'Acreditación de Re-SiCréditos',
      monto: `+${cantidad} CRÉDITOS`,
      tipo: 'green',
    };

    setMovimientos((prev) => [nuevoMovimiento, ...prev]);
  }, []);

  return (
    <WalletContext.Provider value={{ balance, recycledKg, movimientos, agregarCreditos }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
