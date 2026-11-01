// src/components/ui/Pagination.tsx — botones de páginas + selector de filas por página

import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

// Las mismas propiedades que devuelve usePaginacion (menos datosPagina)
interface Props {
  paginaActual: number;
  totalPaginas: number;
  desde: number;
  hasta: number;
  total: number;
  porPagina: number;
  irA: (pagina: number) => void;
  cambiarPorPagina: (n: number) => void;
}

const OPCIONES_POR_PAGINA = [5, 10, 20];

export default function Pagination({
  paginaActual, totalPaginas, desde, hasta, total, porPagina, irA, cambiarPorPagina,
}: Props) {
  // Array.from({ length: 3 }, (_, i) => i + 1) → [1, 2, 3]
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="paginacion">
      <div className="paginacion__info">
        {/* "1–5 de 12" */}
        <span>{total === 0 ? 'Sin resultados' : `${desde}–${hasta} de ${total}`}</span>
        <select
          value={porPagina}
          onChange={(e) => cambiarPorPagina(Number(e.target.value))} // el value del select es texto
          className="paginacion__select"
          aria-label="Filas por página"
        >
          {OPCIONES_POR_PAGINA.map((n) => <option key={n} value={n}>{n} por página</option>)}
        </select>
      </div>

      <div className="paginacion__botones">
        {/* Anterior: deshabilitado en la página 1 */}
        <button
          onClick={() => irA(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="paginacion__boton"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {/* Un botón por página; la actual lleva aria-current="page" */}
        {paginas.map((p) => (
          <button
            key={p}
            onClick={() => irA(p)}
            className="paginacion__boton"
            aria-current={p === paginaActual ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        {/* Siguiente: deshabilitado en la última página */}
        <button
          onClick={() => irA(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="paginacion__boton"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
