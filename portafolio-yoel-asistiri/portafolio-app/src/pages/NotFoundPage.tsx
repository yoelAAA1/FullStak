// src/pages/NotFoundPage.tsx — se muestra en cualquier ruta que no exista (ej. /hola)

import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="no-encontrado">
      <p className="no-encontrado__codigo">404</p>
      <h1 className="no-encontrado__titulo">Página no encontrada</h1>
      <Link to="/" className="enlace">Volver al inicio</Link>
    </div>
  );
}
