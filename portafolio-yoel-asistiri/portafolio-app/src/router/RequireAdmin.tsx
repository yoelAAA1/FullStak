// src/router/RequireAdmin.tsx — "portero" de las rutas /admin/...
// Si no hay sesión, manda al login y recuerda a dónde se quería entrar.
// OJO: la seguridad REAL la pone la API (responde 401 sin la clave). Esto solo evita mostrar pantallas que fallarían.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

export default function RequireAdmin() {
  const { esAdmin } = useAdmin();   // ¿hay sesión?
  const location = useLocation();   // URL actual (ej. /admin/mensajes)

  if (!esAdmin) {
    // replace: no deja la ruta protegida en el historial. state: guardamos de dónde venía
    return <Navigate to="/admin/login" replace state={{ desde: location.pathname }} />;
  }
  // Con sesión: dibuja las rutas hijas
  return <Outlet />;
}
