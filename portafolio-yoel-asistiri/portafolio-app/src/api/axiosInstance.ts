// src/api/axiosInstance.ts — cliente HTTP configurado UNA vez para toda la app

import axios from 'axios';

// Nombre con el que guardamos la clave de admin en sessionStorage
export const CLAVE_ADMIN = 'portafolio-admin-key';

// axios.create: una instancia con configuración propia
const axiosInstance = axios.create({
  // URL base: del .env (VITE_API_URL) o, si no existe, la de desarrollo
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  // Si la API no responde en 10 segundos, se cancela
  timeout: 10000,
});

// Interceptor de PETICIÓN: se ejecuta antes de CADA llamada
axiosInstance.interceptors.request.use((config) => {
  // Leemos la clave guardada al iniciar sesión (null si no hay)
  const clave = sessionStorage.getItem(CLAVE_ADMIN);
  // Si hay clave, la agregamos en el header que revisa el middleware auth.js de la API
  if (clave) config.headers['x-api-key'] = clave;
  // Devolvemos la configuración (obligatorio)
  return config;
});

// Interceptor de RESPUESTA: si todo va bien la deja pasar; si hay error arma un mensaje legible
axiosInstance.interceptors.response.use(
  (response) => response,                 // éxito: sin cambios
  (error) => {
    const data = error.response?.data;    // cuerpo del error que mandó la API (si llegó)
    const mensaje =
      data?.detalles?.join(', ') ||       // 400 de validación: lista de errores
      data?.error ||                      // 401, 404, 409...
      'No se pudo conectar con la API';   // la API está apagada o hay problema de CORS
    // Rechazamos con un Error simple: los componentes solo leen err.message
    return Promise.reject(new Error(mensaje));
  },
);

export default axiosInstance;
