export const validarNombre = (v) => v.trim().length >= 5 && v.trim().split(/\s+/).length >= 2;
export const validarEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const validarUsername = (v) => /^[a-z0-9._]{3,20}$/.test(v.trim().toLowerCase());

export const formatearCuil = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
};

// Valida formato y dígito verificador (no confirma que la persona exista)
export const validarCuil = (v) => {
  const d = v.replace(/\D/g, '');
  if (d.length !== 11) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * Number(d[i]), 0);
  let c = 11 - (suma % 11);
  if (c === 11) c = 0;
  return c !== 10 && c === Number(d[10]);
};

export const reglasPassword = (p) => ({
  largo: p.length >= 8,
  mayusNumero: /[A-Z]/.test(p) && /\d/.test(p),
  especial: /[^A-Za-z0-9]/.test(p),
});