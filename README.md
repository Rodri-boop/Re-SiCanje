# Re-SiCanje

Aplicación móvil académica para explorar una experiencia de reciclaje incentivado: registro de usuarios, lectura de códigos, puntos, comercios y puntos de recepción.

## Tecnologías

- React Native y Expo
- Supabase Auth para registro e inicio de sesión con correo y contraseña
- Expo Camera para leer códigos QR y de barras
- Context API de React para el estado compartido de autenticación, billetera y preferencias

## Puesta en marcha

1. Instalar las dependencias con `npm install`.
2. Configurar `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` en el entorno local de Expo. No publicar credenciales privadas ni incluir archivos `.env` con secretos en el repositorio.
3. Ejecutar `npm start` y abrir el proyecto con Expo Go o un emulador compatible.

Los comandos disponibles son `npm start`, `npm run android`, `npm run ios` y `npm run web`. La lectura de códigos requiere permisos de cámara en dispositivos compatibles.

## Documentación del proyecto

La [documentación técnica y funcional](./Documentacion_Tecnica_y_Funcional_Re-SiCanje.md) presenta el alcance, los flujos funcionales, la arquitectura y las limitaciones de la versión actual. Distingue las funciones implementadas de las que todavía son demostrativas o están previstas para una evolución futura.

## Estado académico del prototipo

La billetera, el catálogo de comercios y de puntos verdes, los canjes, los retiros y los datos de impacto se mantienen en el estado local de la aplicación o se presentan como datos de ejemplo. No representan transacciones financieras ni registros de reciclaje persistidos en un backend.
