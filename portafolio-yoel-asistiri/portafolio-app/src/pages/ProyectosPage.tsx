// src/pages/ProyectosPage.tsx — todos los proyectos con filtros guardados en la URL
// Ruta: /proyectos   (ej. /proyectos?categoria=FRONTEND&tecnologia=React)

import { useSearchParams } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import type { Categoria } from '../interfaces/Proyecto';
import { useProyectos } from '../hooks/useProyectos';
import { useTecnologias } from '../hooks/useTecnologias';
import { CATEGORIAS, LISTA_CATEGORIAS } from '../utils/etiquetas';
import ProyectoCard from '../components/portafolio/ProyectoCard';
import EstadoCarga from '../components/ui/EstadoCarga';
import './ProyectosPage.css';

export default function ProyectosPage() {
  // useSearchParams: leer y cambiar el ?query de la URL.
  // Así el filtro se puede compartir por link y el botón "atrás" del navegador funciona
  const [params, setParams] = useSearchParams();
  const categoria = (params.get('categoria') as Categoria | null) ?? undefined; // null → undefined
  const tecnologia = params.get('tecnologia') ?? undefined;

  // Cada vez que cambian los filtros, el hook vuelve a pedir a la API
  const { proyectos, loading, error } = useProyectos({ categoria, tecnologia });
  // Para llenar el select de tecnologías
  const { tecnologias } = useTecnologias();

  // Cambia UN parámetro de la URL sin perder los demás
  const cambiarFiltro = (clave: 'categoria' | 'tecnologia', valor?: string) => {
    const nuevos = new URLSearchParams(params);   // copia de los parámetros actuales
    if (valor) nuevos.set(clave, valor);          // con valor → lo pone
    else nuevos.delete(clave);                    // sin valor → lo quita ("Todos")
    setParams(nuevos);                            // actualiza la URL → React vuelve a dibujar
  };

  return (
    <div className="proyectos">
      <header className="encabezado-pagina">
        <h1>Mis proyectos</h1>
        <p>Soluciones reales construidas con tecnologías modernas.</p>
      </header>

      <div className="filtros" role="group" aria-label="Filtrar por categoría">
        {/* aria-pressed=true cuando no hay categoría elegida */}
        <button className="filtro" onClick={() => cambiarFiltro('categoria')} aria-pressed={!categoria}>
          Todos
        </button>
        {LISTA_CATEGORIAS.map((c) => (
          <button key={c} className="filtro" onClick={() => cambiarFiltro('categoria', c)} aria-pressed={categoria === c}>
            {CATEGORIAS[c]}
          </button>
        ))}

        <select
          value={tecnologia ?? ''}
          onChange={(e) => cambiarFiltro('tecnologia', e.target.value)}
          className="filtros__select"
          aria-label="Filtrar por tecnología"
        >
          <option value="">Todas las tecnologías</option>
          {tecnologias.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
        </select>
      </div>

      {/* Contador: aria-live hace que el lector de pantalla anuncie el cambio */}
      {!loading && !error && (
        <p className="texto-suave" aria-live="polite">
          {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'}
        </p>
      )}

      <EstadoCarga
        loading={loading}
        error={error}
        vacio={proyectos.length === 0}
        icon={FolderKanban}
        textoVacio="No hay proyectos con esos filtros."
      />

      <div className="grid-tarjetas">
        {proyectos.map((p) => <ProyectoCard key={p.id} proyecto={p} />)}
      </div>
    </div>
  );
}
