// src/components/layout/Layout.tsx — marco común de TODAS las páginas: navbar + contenido + footer

import { Outlet } from 'react-router-dom';   // hueco donde React Router dibuja la página actual
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main contenedor">
        {/* Aquí aparece InicioPage, ProyectosPage, etc. según la URL */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
