import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const fail = (title, message) => ({ ok: false, title, message });

// Supabase devuelve los errores en inglés: los traducimos
const traducirError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (msg.includes('already registered')) return 'Ya existe una cuenta registrada con este correo.';
  if (msg.includes('email not confirmed')) return 'Confirmá tu correo antes de ingresar (revisá tu bandeja).';
  if (msg.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('rate limit')) return 'Demasiados intentos. Probá de nuevo en unos minutos.';
  if (msg.includes('network')) return 'Sin conexión. Revisá tu internet.';
  return error?.message || 'Ocurrió un error inesperado.';
};

// Adaptamos el user de Supabase al formato que usa la app
const toUsuario = (user) =>
  user
    ? { id: user.id, email: user.email, nombre: user.user_metadata?.nombre || user.email.split('@')[0] }
    : null;

export function AuthProvider({ children }) {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [cargando, setCargando] = useState(true); // restaurando sesión guardada

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuarioActivo(toUsuario(data.session?.user));
      setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuarioActivo(toUsuario(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const register = useCallback(async ({ nombre, email, password, confirm }) => {
    if (![nombre, email, password, confirm].every((v) => v.trim())) {
      return fail('Datos incompletos', 'Completá todos los campos para continuar.');
    }
    if (password !== confirm) return fail('Error', 'Las contraseñas no coinciden.');
    if (password.length < 6) return fail('Contraseña débil', 'Usá al menos 6 caracteres.');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { nombre: nombre.trim() } }, // queda en user_metadata
    });

    if (error) return fail('Error al registrarse', traducirError(error));

    // Con "Confirm email" activo, un email ya existente devuelve identities vacío
    if (data.user?.identities?.length === 0) {
      return fail('Usuario existente', 'Ya existe una cuenta registrada con este correo.');
    }

    // Sin sesión = Supabase está esperando que confirme el correo
    return { ok: true, nombre: nombre.trim(), needsConfirmation: !data.session };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (!email.trim() || !password.trim()) {
      return fail('Datos incompletos', 'Ingresá tu correo y contraseña.');
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return fail('Error al ingresar', traducirError(error));
    return { ok: true };
  }, []);

  // TODO: implementar con supabase.auth.signInWithOAuth + expo-auth-session
  const loginWithGoogle = useCallback(async () => {
    return fail('Próximamente', 'El inicio con Google todavía no está disponible.');
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ usuarioActivo, cargando, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);