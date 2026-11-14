import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,      // guarda la sesión en el dispositivo
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,  // no aplica en React Native
    },
  }
);