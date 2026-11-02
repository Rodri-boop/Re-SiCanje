import React, { createContext, useContext, useState, useCallback } from 'react';
import { parseQRReciclaje, formatearPeso, MOBIUS_MATERIALS } from '../utils/mobius';

const WalletContext = createContext(null);

const hora = () => {
  const d = new Date();
  return `Hoy, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(2450);
  const [pesoTotal, setPesoTotal] = useState(8.5); // Peso en kg acumulado
  const [ultimoEscaneo, setUltimoEscaneo] = useState({
    codigo: 'EJEMPLO-QR-INICIAL',
    material: MOBIUS_MATERIALS.pet,
    pesoKg: 0.45,
    valor: 90,
    confianza: '100 % (Verificado por QR)',
  });

  const [movimientos, setMovimientos] = useState([
    { id: '1', titulo: 'Reciclaje PET (0,90 kg)', detalle: 'Hoy, 10:24 • Triángulo Möbius N° 1', monto: 180, icono: 'arrow-down-left' },
    { id: '2', titulo: 'Café Martínez Sustentable', detalle: 'Ayer, 18:15 • Cupón 20% OFF', monto: -450, icono: 'shopping-bag' },
    { id: '3', titulo: 'Reciclaje HDPE (0,55 kg)', detalle: '14/01, 14:02 • Triángulo Möbius N° 2', monto: 120, icono: 'arrow-down-left' },
  ]);

  const addMovimiento = (m) => setMovimientos((p) => [{ id: Date.now().toString(), ...m }, ...p]);

  // Escaneo de QR con tipo de material (Möbius) y peso a reciclar
  const registerScan = useCallback((codigo) => {
    const escaneo = parseQRReciclaje(codigo);

    setUltimoEscaneo({
      codigo,
      material: escaneo.material,
      pesoKg: escaneo.pesoKg,
      valor: escaneo.puntos,
      confianza: '100 % (Verificado por QR)',
    });

    setPesoTotal((p) => Number((p + escaneo.pesoKg).toFixed(2)));
    setBalance((p) => p + escaneo.puntos);

    addMovimiento({
      titulo: `Reciclaje ${escaneo.material.sigla} (${formatearPeso(escaneo.pesoKg)})`,
      detalle: `${hora()} • Triángulo Möbius N° ${escaneo.material.numero}`,
      monto: escaneo.puntos,
      icono: 'arrow-down-left',
    });
  }, []);

  const canjearPuntos = useCallback(({ local, puntos, beneficio }) => {
    if (puntos > balance) {
      return {
        ok: false,
        title: 'Reci-Points insuficientes',
        message: `Necesitás ${puntos} Reci-Points para este beneficio. Tu saldo actual es de ${balance} pts.`
      };
    }
    const cupon = `RECI-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setBalance((p) => p - puntos);
    addMovimiento({
      titulo: `Canje en ${local}`,
      detalle: `${hora()} • ${beneficio}`,
      monto: -puntos,
      icono: 'shopping-bag',
    });
    return { ok: true, cupon };
  }, [balance]);

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

  // botellas como compatibilidad para componentes existentes
  const botellas = Math.round(pesoTotal / 0.045);

  return (
    <WalletContext.Provider value={{ balance, pesoTotal, botellas, ultimoEscaneo, movimientos, registerScan, canjearPuntos, withdraw }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
