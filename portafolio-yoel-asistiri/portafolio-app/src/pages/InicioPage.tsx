// src/pages/InicioPage.tsx — portada: presentación + proyectos destacados + habilidades
// Ruta: /

import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban, Layers } from 'lucide-react';
import { useProyectos } from '../hooks/useProyectos';
import { useTecnologias } from '../hooks/useTecnologias';
import { PERFIL } from '../utils/etiquetas';
import ProyectoCard from '../components/portafolio/ProyectoCard';
import Habilidades from '../components/portafolio/Habilidades';
import EstadoCarga from '../components/ui/EstadoCarga';
import '../components/ui/Button.css';   // los Link del hero usan las clases .btn
import './InicioPage.css';

export default function InicioPage() {
  // GET /api/proyectos?destacado=true
  const destacados = useProyectos({ destacado: true });
  // GET /api/tecnologias
  const habilidades = useTecnologias();

  return (
    <div className="inicio">
      {/* ---------- Hero / presentación ---------- */}
      <section className="hero">
        {/* Iniciales: Yoel Asistiri → YA */}
        <div className="hero__avatar" aria-hidden="true">YA</div>
        <span className="hero__insignia">Disponible para proyectos</span>
        <h1 className="hero__titulo">
          Hola, soy <span className="texto-gradiente">{PERFIL.nombreCompleto}</span>
        </h1>
        <p className="hero__texto">
          {PERFIL.rol} especializado en soluciones web modernas con React, Node.js y PostgreSQL.
        </p>
        <div className="hero__acciones">
          <Link to="/proyectos" className="btn btn--primary btn--grande">
            Ver proyectos <ArrowRight size={18} />
          </Link>
          <Link to="/contacto" className="btn btn--contorno btn--grande">Contáctame</Link>
        </div>
      </section>

      {/* ---------- Proyectos destacados ---------- */}
      <section aria-labelledby="titulo-destacados" className="seccion">
        <h2 id="titulo-destacados" className="seccion__titulo">Proyectos destacados</h2>
        <EstadoCarga
          loading={destacados.loading}
          error={destacados.error}
          vacio={destacados.proyectos.length === 0}
          icon={FolderKanban}
          textoVacio="Todavía no hay proyectos destacados."
        />
        <div className="grid-tarjetas">
          {destacados.proyectos.map((p) => <ProyectoCard key={p.id} proyecto={p} />)}
        </div>
      </section>

      {/* ---------- Habilidades ---------- */}
      <section aria-labelledby="titulo-habilidades" className="seccion">
        <h2 id="titulo-habilidades" className="seccion__titulo">Habilidades</h2>
        <EstadoCarga
          loading={habilidades.loading}
          error={habilidades.error}
          vacio={habilidades.tecnologias.length === 0}
          icon={Layers}
          textoVacio="Todavía no hay tecnologías registradas."
        />
        <Habilidades tecnologias={habilidades.tecnologias} />
      </section>
    </div>
  );
}
