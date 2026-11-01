// src/components/layout/AdminLayout.tsx — cabecera y pestañas del panel de administración

import { startTransition } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../ui/Button';
import './AdminLayout.css';

// Pestañas del panel
const pestanas = [
  { to: '/admin/proyectos',   label: 'Proyectos' },
  { to: '/admin/tecnologias', label: 'Tecnologías' },
  { to: '/admin/mensajes',    label: 'Mensajes' },
];

export default function AdminLayout() {
  const { salir } = useAdmin();     // función para cerrar sesión
  const navigate = useNavigate();   // función para cambiar de página desde código

  const handleSalir = () => {
    // startTransition aplica las dos actualizaciones JUNTAS.
    // Si salir() se aplicara antes de navegar, RequireAdmin vería "sin sesión" y mandaría al login en vez de a "/"
    startTransition(() => {
      salir();
      navigate('/');
    });
  };

  return (
    <div className="admin">
      <div className="admin__cabecera">
        <h1 className="admin__titulo">Panel de administración</h1>
        <Button variant="ghost" onClick={handleSalir} icon={<LogOut size={16} />}>Salir</Button>
      </div>

      <nav className="admin__pestanas" aria-label="Secciones del panel">
        {pestanas.map(({ to, label }) => (
          <NavLink key={to} to={to} className="admin__pestana">{label}</NavLink>
        ))}
      </nav>

      {/* Aquí se dibuja AdminProyectosPage, AdminTecnologiasPage o AdminMensajesPage */}
      <Outlet />
    </div>
  );
}
