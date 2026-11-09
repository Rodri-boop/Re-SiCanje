import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const fail = (title, message) => ({ ok: false, title, message });

const traducirError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (msg.includes('already registered')) return 'Ya existe una cuenta registrada con este correo.';
  if (msg.includes('email not confirmed')) return 'Confirma tu correo antes de ingresar.';
  if (msg.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  return error?.message || 'Ocurrió un error inesperado.';
};

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const toUsuario = (user) =>
  user
    ? { 
        id: user.id, 
        email: user.email, 
        nombre: user.user_metadata?.nombre || user.email.split('@')[0] 
      }
    : null;

export function AuthProvider({ children }) {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUsuarioActivo(toUsuario(data.session?.user));
        setCargando(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUsuarioActivo(toUsuario(session?.user));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(async ({ nombre, email, password, confirm }) => {
    const nombreClean = nombre?.trim() || '';
    const emailClean = email?.trim().toLowerCase() || '';

    if (![nombreClean, emailClean, password, confirm].every(Boolean)) {
      return fail('Datos incompletos', 'Completa todos los campos para continuar.');
    }
    if (!validarEmail(emailClean)) {
      return fail('Correo inválido', 'Ingresa una dirección de correo válida.');
    }
    if (password !== confirm) {
      return fail('Error', 'Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return fail('Contraseña débil', 'Usa al menos 6 caracteres.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: emailClean,
      password,
      options: { data: { nombre: nombreClean } },
    });

    if (error) return fail('Error al registrarse', traducirError(error));
    if (data.user?.identities?.length === 0) {
      return fail('Usuario existente', 'Ya existe una cuenta con este correo.');
    }

    return { ok: true, nombre: nombreClean, needsConfirmation: !data.session };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const emailClean = email?.trim().toLowerCase() || '';
    
    if (!emailClean || !password?.trim()) {
      return fail('Datos incompletos', 'Ingresa tu correo y contraseña.');
    }
    if (!validarEmail(emailClean)) {
      return fail('Correo inválido', 'Ingresa un formato de correo válido.');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailClean,
      password,
    });

    if (error) return fail('Error al ingresar', traducirError(error));
    return { ok: true };
  }, []);

  const resetPassword = useCallback(async (email) => {
    const emailClean = email?.trim().toLowerCase() || '';
    if (!emailClean || !validarEmail(emailClean)) {
      return fail('Correo inválido', 'Ingresa un correo electrónico válido.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailClean);
    if (error) return fail('Error al enviar', traducirError(error));
    return { ok: true, message: 'Te enviamos un enlace de recuperación a tu correo electrónico.' };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ usuarioActivo, cargando, register, login, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
