// src/components/layout/Navbar.tsx — barra de navegación superior

import { Link, NavLink } from 'react-router-dom';
import { FolderKanban, House, Lock, Mail } from 'lucide-react';
import { PERFIL } from '../../utils/etiquetas';

// Lista de enlaces: así el menú se arma con .map() y es fácil agregar uno nuevo
const links = [
  { to: '/',          label: 'Inicio',    icon: House },
  { to: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { to: '/contacto',  label: 'Contacto',  icon: Mail },
  { to: '/admin',     label: 'Admin',     icon: Lock },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar__contenido contenedor">
        {/* Link cambia de página SIN recargar el navegador (a diferencia de <a href>) */}
        <Link to="/" className="navbar__logo texto-gradiente">{PERFIL.nombreCorto}</Link>
        <ul className="navbar__menu">
          {/* icon: Icon → renombramos para usarlo como componente <Icon /> */}
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              {/* NavLink agrega la clase "active" si su ruta es la actual.
                  end en "/": sin él, "Inicio" quedaría activo en todas las rutas */}
              <NavLink to={to} end={to === '/'} className="navbar__enlace">
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
