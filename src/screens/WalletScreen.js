import React, { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

const PUNTOS_POR_BOTELLA = 50;
const KG_POR_BOTELLA = 0.05;

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(2450);
  const [recycledKg, setRecycledKg] = useState(15.4);
  const [ultimoCodigo, setUltimoCodigo] = useState(null);
  const [movimientos, setMovimientos] = useState([
    { id: '1', texto: '+ 12 Botellas PET depositadas', monto: '+$600 ARS', tipo: 'green' },
    { id: '2', texto: '+ 8 Latas de Aluminio', monto: '+$400 ARS', tipo: 'green' },
    { id: '3', texto: '- Retiro enviado a Mercado Pago', monto: '-$1.000 ARS', tipo: 'blue' },
  ]);

  const addMovimiento = (mov) =>
    setMovimientos((prev) => [{ id: Date.now().toString(), ...mov }, ...prev]);

  const registerScan = useCallback((codigo) => {
    setUltimoCodigo(codigo);
    setBalance((p) => p + PUNTOS_POR_BOTELLA);
    setRecycledKg((p) => +(p + KG_POR_BOTELLA).toFixed(2));
    addMovimiento({
      texto: '+ 1 Envase escaneado',
      monto: `+$${PUNTOS_POR_BOTELLA} ARS`,
      tipo: 'green',
    });
    return PUNTOS_POR_BOTELLA;
  }, []);

  const withdraw = useCallback(({ cvu, titular, monto }) => {
    if (!cvu.trim() || !titular.trim()) {
      return { ok: false, title: 'Error', message: 'Ingresá el CVU/Alias y el Titular de Mercado Pago.' };
    }
    const montoNum = parseInt(monto, 10) || 0;
    if (montoNum <= 0) return { ok: false, title: 'Error', message: 'Ingresá un monto válido mayor a 0.' };
    if (montoNum > balance) {
      return { ok: false, title: 'Saldo insuficiente', message: 'El monto supera tu saldo disponible.' };
    }
    setBalance((p) => p - montoNum);
    addMovimiento({
      texto: `- Retiro enviado a ${titular}`,
      monto: `-$${montoNum.toLocaleString()} ARS`,
      tipo: 'blue',
    });
    return { ok: true, monto: montoNum };
  }, [balance]);

  return (
    <WalletContext.Provider
      value={{
        balance, recycledKg, movimientos, ultimoCodigo,
        puntosPorBotella: PUNTOS_POR_BOTELLA, registerScan, withdraw,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);