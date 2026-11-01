// src/components/layout/Footer.tsx — pie de página

import { PERFIL } from '../../utils/etiquetas';

// Fuera del componente: se calcula una sola vez y el render queda "puro"
const ANIO = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenido contenedor">
        <p>© {ANIO} {PERFIL.nombreCompleto} · {PERFIL.ubicacion}</p>
        <p className="footer__stack">React · Node.js · Express · Prisma · PostgreSQL</p>
      </div>
    </footer>
  );
}
