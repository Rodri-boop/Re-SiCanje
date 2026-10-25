import React, { useState } from 'react';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterStep1 from '../screens/RegisterStep1';
import RegisterStep2 from '../screens/RegisterStep2';

const FORM_VACIO = { nombre: '', email: '', cuil: '', username: '', password: '', confirm: '' };

export default function AuthNavigator() {
  const [paso, setPaso] = useState('welcome');
  const [form, setForm] = useState(FORM_VACIO);
  const props = { go: setPaso, form, setForm };

  if (paso === 'login') return <LoginScreen {...props} />;
  if (paso === 'reg1') return <RegisterStep1 {...props} />;
  if (paso === 'reg2') return <RegisterStep2 {...props} />;
  return <WelcomeScreen {...props} />;
}