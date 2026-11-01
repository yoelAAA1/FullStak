// src/router/AppRouter.tsx — MAPA DE RUTAS: qué página se ve en cada URL

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import RequireAdmin from './RequireAdmin';
import InicioPage from '../pages/InicioPage';
import ProyectosPage from '../pages/ProyectosPage';
import ProyectoDetallePage from '../pages/ProyectoDetallePage';
import ContactoPage from '../pages/ContactoPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/admin/LoginPage';
import AdminProyectosPage from '../pages/admin/AdminProyectosPage';
import AdminTecnologiasPage from '../pages/admin/AdminTecnologiasPage';
import AdminMensajesPage from '../pages/admin/AdminMensajesPage';

export default function AppRouter() {
  return (
    // BrowserRouter: usa la URL real del navegador (/proyectos, /contacto...)
    <BrowserRouter>
      <Routes>
        {/* Ruta de LAYOUT (sin path): todas las de adentro se dibujan en el <Outlet /> de Layout */}
        <Route element={<Layout />}>
          {/* ---------- Portafolio público ---------- */}
          <Route index element={<InicioPage />} />                          {/* /             */}
          <Route path="proyectos" element={<ProyectosPage />} />            {/* /proyectos    */}
          <Route path="proyectos/:id" element={<ProyectoDetallePage />} />  {/* /proyectos/3  */}
          <Route path="contacto" element={<ContactoPage />} />              {/* /contacto     */}

          {/* ---------- Administración ---------- */}
          <Route path="admin/login" element={<LoginPage />} />              {/* /admin/login  */}
          {/* Primero RequireAdmin revisa la sesión, luego AdminLayout dibuja pestañas, luego la página */}
          <Route path="admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="proyectos" replace />} />  {/* /admin → /admin/proyectos */}
              <Route path="proyectos" element={<AdminProyectosPage />} />    {/* /admin/proyectos   */}
              <Route path="tecnologias" element={<AdminTecnologiasPage />} />{/* /admin/tecnologias */}
              <Route path="mensajes" element={<AdminMensajesPage />} />      {/* /admin/mensajes    */}
            </Route>
          </Route>

          {/* Cualquier otra URL → 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
