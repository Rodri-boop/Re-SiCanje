import React, { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

const PUNTOS_POR_BOTELLA = 50;
const KG_POR_BOTELLA = 0.05;

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(2450);
  const [recycledKg, setRecycledKg] = useState(15.4);
  const [movimientos, setMovimientos] = useState([
    { id: '1', texto: '+ 12 Botellas PET depositadas', monto: '+$600 ARS', tipo: 'green' },
    { id: '2', texto: '+ 8 Latas de Aluminio', monto: '+$400 ARS', tipo: 'green' },
    { id: '3', texto: '- Retiro enviado a Mercado Pago', monto: '-$1.000 ARS', tipo: 'blue' },
  ]);

  const addMovimiento = (mov) =>
    setMovimientos((prev) => [{ id: Date.now().toString(), ...mov }, ...prev]);

  const registerScan = useCallback((cantidadBotellas = 1) => {
    const totalPuntos = PUNTOS_POR_BOTELLA * cantidadBotellas;
    const totalKg = +(KG_POR_BOTELLA * cantidadBotellas).toFixed(2);

    setBalance((p) => p + totalPuntos);
    setRecycledKg((p) => +(p + totalKg).toFixed(2));
    
    addMovimiento({
      texto: `+ ${cantidadBotellas} Botella${cantidadBotellas > 1 ? 's' : ''} PET depositada${cantidadBotellas > 1 ? 's' : ''}`,
      monto: `+$${totalPuntos.toLocaleString()} ARS`,
      tipo: 'green',
    });

    return totalPuntos;
  }, []);

  const withdraw = useCallback(({ cvu, titular, monto }) => {
    const cvuClean = cvu?.trim() || '';
    const titularClean = titular?.trim() || '';

    if (!cvuClean || !titularClean) {
      return { ok: false, title: 'Datos incompletos', message: 'Ingresá el CVU/Alias y el Titular de Mercado Pago.' };
    }

    const montoNum = parseInt(monto, 10);
    if (isNaN(montoNum) || montoNum <= 0) {
      return { ok: false, title: 'Monto inválido', message: 'Ingresá un monto numérico mayor a 0.' };
    }
    if (montoNum > balance) {
      return { ok: false, title: 'Saldo insuficiente', message: 'El monto ingresado supera tu saldo disponible.' };
    }

    setBalance((p) => p - montoNum);
    addMovimiento({
      texto: `- Retiro enviado a ${titularClean}`,
      monto: `-$${montoNum.toLocaleString()} ARS`,
      tipo: 'blue',
    });

    return { ok: true, monto: montoNum };
  }, [balance]);

  return (
    <WalletContext.Provider
      value={{ 
        balance, 
        recycledKg, 
        movimientos, 
        puntosPorBotella: PUNTOS_POR_BOTELLA, 
        registerScan, 
        withdraw 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);