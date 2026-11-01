// src/pages/ProyectoDetallePage.tsx — detalle de UN proyecto
// Ruta: /proyectos/:id   (ej. /proyectos/3)

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CodeXml, ExternalLink, FolderKanban } from 'lucide-react';
import type { Proyecto } from '../interfaces/Proyecto';
import { proyectoService } from '../services/proyectoService';
import { CATEGORIAS } from '../utils/etiquetas';
import Badge from '../components/ui/Badge';
import EstadoCarga from '../components/ui/EstadoCarga';
import '../components/ui/Button.css';   // los enlaces "Ver demo" y "Ver código" usan .btn
import './ProyectoDetallePage.css';

export default function ProyectoDetallePage() {
  // useParams lee el :id de la URL (siempre llega como TEXTO)
  const { id } = useParams();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que cambia el id, pedimos ese proyecto a la API
  useEffect(() => {
    let cancelado = false;   // evita guardar la respuesta si el usuario ya cambió de proyecto

    proyectoService
      .getById(Number(id))   // "3" → 3. Con "abc" la API responde 400 y mostramos su mensaje
      .then((data) => { if (!cancelado) setProyecto(data); })
      .catch((err: Error) => { if (!cancelado) setError(err.message); });

    return () => { cancelado = true; };   // limpieza al cambiar de id o salir de la página
  }, [id]);

  // Mientras no llega el proyecto de ESTE id, se considera "cargando"
  const loading = !error && proyecto?.id !== Number(id);

  return (
    <div className="detalle">
      <Link to="/proyectos" className="detalle__volver">
        <ArrowLeft size={16} /> Volver a proyectos
      </Link>

      <EstadoCarga loading={loading} error={error} vacio={false} icon={FolderKanban} textoVacio="" />

      {!loading && proyecto && (
        <article className="detalle__tarjeta tarjeta">
          <div className="detalle__imagen" aria-hidden="true">{proyecto.emoji}</div>
          <div className="detalle__cuerpo">
            <Badge variante={proyecto.categoria.toLowerCase()}>{CATEGORIAS[proyecto.categoria]}</Badge>
            <h1 className="detalle__titulo">{proyecto.titulo}</h1>
            <p className="detalle__descripcion">{proyecto.descripcion}</p>

            <ul className="lista-etiquetas" aria-label="Tecnologías">
              {proyecto.tecnologias.map((t) => <li key={t.id}><Badge>{t.nombre}</Badge></li>)}
            </ul>

            <div className="detalle__enlaces">
              {/* Solo si el proyecto tiene URL. target="_blank" abre en otra pestaña;
                  rel="noopener noreferrer" es por seguridad */}
              {proyecto.urlDemo && (
                <a href={proyecto.urlDemo} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                  <ExternalLink size={16} /> Ver demo
                </a>
              )}
              {proyecto.urlRepo && (
                <a href={proyecto.urlRepo} target="_blank" rel="noopener noreferrer" className="btn btn--oscuro">
                  <CodeXml size={16} /> Ver código
                </a>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
