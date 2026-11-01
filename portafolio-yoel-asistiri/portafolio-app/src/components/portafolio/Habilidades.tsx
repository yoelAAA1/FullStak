// src/components/portafolio/Habilidades.tsx — agrupa las tecnologías por área y dibuja una tarjeta por área

import { Database, Monitor, Server, Wrench } from 'lucide-react';
import type { AreaTecnologia, Tecnologia } from '../../interfaces/Tecnologia';
import { AREAS, LISTA_AREAS } from '../../utils/etiquetas';
import './Habilidades.css';

// Ícono de cada área
const ICONOS = { FRONTEND: Monitor, BACKEND: Server, BASE_DATOS: Database, HERRAMIENTA: Wrench };

export default function Habilidades({ tecnologias }: { tecnologias: Tecnologia[] }) {
  // reduce: convierte el array en un objeto agrupado → { FRONTEND: [...], BACKEND: [...] }
  // Partial<Record<...>> = objeto que PUEDE tener esas claves (no todas obligatorias)
  const porArea = tecnologias.reduce<Partial<Record<AreaTecnologia, Tecnologia[]>>>((acc, t) => {
    // ??= crea el array solo si todavía no existe; luego agrega la tecnología
    (acc[t.area] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="habilidades">
      {/* Solo las áreas que tienen al menos una tecnología */}
      {LISTA_AREAS.filter((area) => porArea[area]).map((area) => {
        const Icon = ICONOS[area];
        return (
          <article key={area} className="habilidad tarjeta">
            <Icon className="habilidad__icono" aria-hidden="true" />
            <h3 className="habilidad__titulo">{AREAS[area]}</h3>
            <ul className="habilidad__lista">
              {/* "!" le dice a TypeScript que aquí sí existe (lo filtramos arriba) */}
              {porArea[area]!.map((t) => (
                <li key={t.id} className="habilidad__item">
                  <span>{t.nombre}</span>
                  {/* ?. y ?? : si no vino _count, mostramos 0 */}
                  <span className="habilidad__usos">{t._count?.proyectos ?? 0} proy.</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
