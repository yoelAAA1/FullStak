// src/components/portafolio/ProyectoCard.tsx — tarjeta de un proyecto en la grilla

import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Proyecto } from '../../interfaces/Proyecto';
import { CATEGORIAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import './ProyectoCard.css';

// Recibe un proyecto por props
export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  // Destructuring: sacamos los campos que vamos a mostrar
  const { id, titulo, descripcion, emoji, categoria, destacado, tecnologias } = proyecto;

  return (
    <article className="proyecto-card tarjeta">
      {/* aria-hidden: el emoji es decorativo, el lector de pantalla lo ignora */}
      <div className="proyecto-card__imagen" aria-hidden="true">{emoji}</div>
      <div className="proyecto-card__cuerpo">
        <div className="proyecto-card__fila">
          {/* 'FRONTEND' → 'frontend' → clase badge--frontend */}
          <Badge variante={categoria.toLowerCase()}>{CATEGORIAS[categoria]}</Badge>
          {/* && : si destacado es true, dibuja la estrella; si es false, nada */}
          {destacado && <Star size={16} className="icono-destacado" aria-label="Destacado" />}
        </div>
        <h3 className="proyecto-card__titulo">
          {/* Enlace al detalle: /proyectos/3 */}
          <Link to={`/proyectos/${id}`}>{titulo}</Link>
        </h3>
        <p className="proyecto-card__descripcion">{descripcion}</p>
        <ul className="lista-etiquetas" aria-label="Tecnologías">
          {/* key: React necesita un identificador único en cada elemento de una lista */}
          {tecnologias.map((t) => (
            <li key={t.id}><Badge>{t.nombre}</Badge></li>
          ))}
        </ul>
      </div>
    </article>
  );
}
