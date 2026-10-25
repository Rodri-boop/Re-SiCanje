import React, { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

const VALOR_POR_BOTELLA = 15;

const hora = () => {
  const d = new Date();
  return `Hoy, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(2450);
  const [botellas, setBotellas] = useState(142);
  const [ultimoEscaneo, setUltimoEscaneo] = useState(null);
  const [movimientos, setMovimientos] = useState([
    { id: '1', titulo: 'Canje en Punto Verde', detalle: 'Hoy, 10:24 • 12 botellas', monto: 180, icono: 'arrow-down-left' },
    { id: '2', titulo: 'Descuento en café', detalle: 'Ayer, 18:15 • Canjeado', monto: -500, icono: 'shopping-bag' },
    { id: '3', titulo: 'Canje en Supermercado', detalle: '14/01, 14:02 • 8 botellas', monto: 120, icono: 'arrow-down-left' },
  ]);

  const addMovimiento = (m) => setMovimientos((p) => [{ id: Date.now().toString(), ...m }, ...p]);

  // TODO: estos valores (material, peso, confianza) son de relleno hasta conectar el modelo de visión
  const registerScan = useCallback((codigo) => {
    setUltimoEscaneo({ codigo, material: 'PET 1 (polietileno)', peso: '~45 gramos', confianza: '98,4 %', valor: VALOR_POR_BOTELLA });
    setBalance((p) => p + VALOR_POR_BOTELLA);
    setBotellas((p) => p + 1);
    addMovimiento({ titulo: 'Canje por escaneo', detalle: `${hora()} • 1 botella`, monto: VALOR_POR_BOTELLA, icono: 'arrow-down-left' });
  }, []);

  const withdraw = useCallback(({ cvu, titular, monto }) => {
    if (!cvu.trim() || !titular.trim()) {
      return { ok: false, title: 'Error', message: 'Ingresá el CVU/Alias y el Titular de Mercado Pago.' };
    }
    const montoNum = parseInt(monto, 10) || 0;
    if (montoNum <= 0) return { ok: false, title: 'Error', message: 'Ingresá un monto válido mayor a 0.' };
    if (montoNum > balance) return { ok: false, title: 'Saldo insuficiente', message: 'El monto supera tu saldo disponible.' };
    setBalance((p) => p - montoNum);
    addMovimiento({ titulo: `Retiro a ${titular}`, detalle: `${hora()} • Mercado Pago`, monto: -montoNum, icono: 'arrow-up-right' });
    return { ok: true, monto: montoNum };
  }, [balance]);

  return (
    <WalletContext.Provider value={{ balance, botellas, ultimoEscaneo, movimientos, registerScan, withdraw }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);