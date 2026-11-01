// src/components/tables/ProyectosTable.tsx — tabla de proyectos del panel admin

import { Pencil, Star, Trash2 } from 'lucide-react';
import type { Proyecto } from '../../interfaces/Proyecto';
import { usePaginacion } from '../../hooks/usePaginacion';
import { CATEGORIAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  proyectos: Proyecto[];
  onEditar: (proyecto: Proyecto) => void;     // el padre abre el modal de edición
  onEliminar: (proyecto: Proyecto) => void;   // el padre confirma y borra
}

export default function ProyectosTable({ proyectos, onEditar, onEliminar }: Props) {
  // datosPagina = filas de la página actual; ...paginacion = el resto (se pasa a <Pagination>)
  const { datosPagina, ...paginacion } = usePaginacion(proyectos);

  return (
    <div className="tarjeta">
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Categoría</th>
              <th>Tecnologías</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="tabla__proyecto">
                    <span aria-hidden="true">{p.emoji}</span>
                    {p.titulo}
                    {p.destacado && <Star size={14} className="icono-destacado" aria-label="Destacado" />}
                  </span>
                </td>
                <td><Badge variante={p.categoria.toLowerCase()}>{CATEGORIAS[p.categoria]}</Badge></td>
                {/* Nombres separados por coma; si no hay, una raya */}
                <td className="tabla__secundario">{p.tecnologias.map((t) => t.nombre).join(', ') || '—'}</td>
                <td>
                  <div className="tabla__acciones">
                    {/* () => onEditar(p): función flecha para pasar ESTE proyecto */}
                    <Button variant="ghost" onClick={() => onEditar(p)} icon={<Pencil size={14} />}>Editar</Button>
                    <Button variant="danger" onClick={() => onEliminar(p)} icon={<Trash2 size={14} />}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Spread: pasa todas las propiedades de paginacion como props */}
      <Pagination {...paginacion} />
    </div>
  );
}
