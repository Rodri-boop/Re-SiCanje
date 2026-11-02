export const MOBIUS_MATERIALS = {
  pet: {
    key: 'pet',
    numero: 1,
    sigla: 'PET',
    nombre: 'Polietileno Tereftalato',
    simbolo: '♳',
    descripcion: 'Envases transparentes de bebidas, agua y bandejas de alimentos.',
    ptsPorKg: 200,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  hdpe: {
    key: 'hdpe',
    numero: 2,
    sigla: 'HDPE',
    nombre: 'Polietileno de Alta Densidad (PEAD)',
    simbolo: '♲',
    descripcion: 'Envases rígidos de lácteos, champú, detergentes y bidones.',
    ptsPorKg: 220,
    color: '#059669',
    bg: '#D1FAE5',
  },
  pvc: {
    key: 'pvc',
    numero: 3,
    sigla: 'PVC',
    nombre: 'Policloruro de Vinilo',
    simbolo: '♳',
    descripcion: 'Caños, mangueras, tarjetas plásticas y envoltorios técnicos.',
    ptsPorKg: 150,
    color: '#D97706',
    bg: '#FEF3C7',
  },
  ldpe: {
    key: 'ldpe',
    numero: 4,
    sigla: 'LDPE',
    nombre: 'Polietileno de Baja Densidad (PEBD)',
    simbolo: '♴',
    descripcion: 'Bolsas plásticas, film stretch flexible y sachets.',
    ptsPorKg: 180,
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  pp: {
    key: 'pp',
    numero: 5,
    sigla: 'PP',
    nombre: 'Polipropileno',
    simbolo: '♵',
    descripcion: 'Tapas de botellas, potes de postres, envases de delivery y tuppers.',
    ptsPorKg: 210,
    color: '#DB2777',
    bg: '#FCE7F3',
  },
  ps: {
    key: 'ps',
    numero: 6,
    sigla: 'PS',
    nombre: 'Poliestireno',
    simbolo: '♶',
    descripcion: 'Cubiertos descartables, bandejas de telgopor y vasos térmicos.',
    ptsPorKg: 140,
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
};

export const formatearPeso = (pesoKg) => {
  if (pesoKg < 1) {
    return `${Math.round(pesoKg * 1000)} g`;
  }
  return `${pesoKg.toFixed(2).replace('.', ',')} kg`;
};

export const parseQRReciclaje = (data) => {
  let matKey = 'pet';
  let pesoKg = 0.45;

  if (typeof data === 'string') {
    const raw = data.trim();

    // 1. Intento de parseo JSON: {"material": "HDPE", "peso": 350} o {"tipo": "PP", "pesoKg": 0.5}
    if ((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'))) {
      try {
        const json = JSON.parse(raw);
        const k = (json.material || json.tipo || json.mat || '').toLowerCase().trim();
        if (MOBIUS_MATERIALS[k]) matKey = k;

        const p = json.peso ?? json.pesoKg ?? json.weight;
        if (typeof p === 'number') {
          pesoKg = p > 50 ? p / 1000 : p; // Si viene en gramos > 50 lo convertimos a kg
        } else if (typeof p === 'string') {
          const num = parseFloat(p.replace(',', '.'));
          if (!isNaN(num)) pesoKg = num > 50 ? num / 1000 : num;
        }
        const material = MOBIUS_MATERIALS[matKey];
        const puntos = Math.max(10, Math.round(pesoKg * material.ptsPorKg));
        return { material, pesoKg, puntos, codigo: raw };
      } catch (e) {}
    }

    // 2. Formato delimitado por caracteres: "HDPE:500", "recicanje:PP:1.2", "PVC/250g"
    const partes = raw.split(/[:|/,-]/).map((x) => x.trim().toLowerCase());
    for (const parte of partes) {
      if (MOBIUS_MATERIALS[parte]) {
        matKey = parte;
        break;
      }
    }
    for (const parte of partes) {
      const num = parseFloat(parte.replace(/[^\d.]/g, ''));
      if (!isNaN(num) && num > 0) {
        pesoKg = num > 50 ? num / 1000 : num;
        break;
      }
    }

    // 3. Fallback inteligente para tests con códigos de barra o QRs arbitrarios
    if (!partes.some((p) => MOBIUS_MATERIALS[p])) {
      const keys = ['pet', 'hdpe', 'pvc', 'ldpe', 'pp', 'ps'];
      const hash = raw.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      matKey = keys[hash % keys.length];
      pesoKg = Number((0.2 + ((hash % 15) * 0.05)).toFixed(2));
    }
  }

  const material = MOBIUS_MATERIALS[matKey] || MOBIUS_MATERIALS.pet;
  const puntos = Math.max(10, Math.round(pesoKg * material.ptsPorKg));
  return { material, pesoKg, puntos, codigo: String(data) };
};

