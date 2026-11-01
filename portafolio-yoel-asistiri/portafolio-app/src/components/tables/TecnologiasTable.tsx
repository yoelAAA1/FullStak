// src/components/tables/TecnologiasTable.tsx — tabla de tecnologías del panel admin

import { Pencil, Trash2 } from 'lucide-react';
import type { Tecnologia } from '../../interfaces/Tecnologia';
import { usePaginacion } from '../../hooks/usePaginacion';
import { AREAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  tecnologias: Tecnologia[];
  onEditar: (tecnologia: Tecnologia) => void;
  onEliminar: (tecnologia: Tecnologia) => void;
}

export default function TecnologiasTable({ tecnologias, onEditar, onEliminar }: Props) {
  // 10 filas por página al inicio
  const { datosPagina, ...paginacion } = usePaginacion(tecnologias, 10);

  return (
    <div className="tarjeta">
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Área</th>
              <th>Usada en</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.map((t) => (
              <tr key={t.id}>
                <td className="tabla__proyecto">{t.nombre}</td>
                <td><Badge>{AREAS[t.area]}</Badge></td>
                <td className="tabla__secundario">{t._count?.proyectos ?? 0} proyecto(s)</td>
                <td>
                  <div className="tabla__acciones">
                    <Button variant="ghost" onClick={() => onEditar(t)} icon={<Pencil size={14} />}>Editar</Button>
                    <Button variant="danger" onClick={() => onEliminar(t)} icon={<Trash2 size={14} />}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...paginacion} />
    </div>
  );
}
