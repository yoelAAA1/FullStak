// src/pages/admin/AdminProyectosPage.tsx — CRUD de proyectos
// Ruta: /admin/proyectos

import { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import type { Proyecto, ProyectoDTO } from '../../interfaces/Proyecto';
import { useProyectos } from '../../hooks/useProyectos';
import { useTecnologias } from '../../hooks/useTecnologias';
import ProyectoForm from '../../components/forms/ProyectoForm';
import ProyectosTable from '../../components/tables/ProyectosTable';
import Button from '../../components/ui/Button';
import EstadoCarga from '../../components/ui/EstadoCarga';
import Modal from '../../components/ui/Modal';

// Un solo estado para el modal: undefined = cerrado · null = crear · Proyecto = editar ese proyecto
type Edicion = Proyecto | null | undefined;

export default function AdminProyectosPage() {
  const { proyectos, loading, error, crear, actualizar, eliminar } = useProyectos(); // sin filtros: todos
  const { tecnologias } = useTecnologias();                                          // para los checkbox
  const [edicion, setEdicion] = useState<Edicion>(undefined);
  const [formError, setFormError] = useState<string | null>(null);     // error dentro del modal
  const [accionError, setAccionError] = useState<string | null>(null); // error al eliminar

  const abrir = (proyecto: Proyecto | null) => {
    setFormError(null);
    setEdicion(proyecto);
  };
  const cerrar = () => setEdicion(undefined);

  // Guardar: si hay proyecto en edición → PUT; si no → POST
  const handleGuardar = async (data: ProyectoDTO) => {
    try {
      setFormError(null);
      if (edicion) await actualizar(edicion.id, data);
      else await crear(data);
      cerrar();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleEliminar = async (proyecto: Proyecto) => {
    if (!confirm(`¿Eliminar "${proyecto.titulo}"?`)) return;   // cuadro de confirmación del navegador
    try {
      setAccionError(null);
      await eliminar(proyecto.id);
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  return (
    <section className="panel">
      <div className="panel__barra">
        <p className="texto-suave">{proyectos.length} proyecto(s)</p>
        <Button onClick={() => abrir(null)} icon={<Plus size={16} />}>Nuevo proyecto</Button>
      </div>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga loading={loading} error={error} vacio={proyectos.length === 0} icon={FolderKanban} textoVacio="Crea el primer proyecto." />
      {!loading && proyectos.length > 0 && (
        <ProyectosTable proyectos={proyectos} onEditar={abrir} onEliminar={handleEliminar} />
      )}

      <Modal open={edicion !== undefined} onClose={cerrar} title={edicion ? 'Editar proyecto' : 'Nuevo proyecto'}>
        {formError && <p role="alert" className="alerta alerta--error">{formError}</p>}
        {/* key: al cambiar de proyecto, React crea un formulario NUEVO con los valores correctos */}
        <ProyectoForm
          key={edicion?.id ?? 'nuevo'}
          proyecto={edicion ?? undefined}
          tecnologias={tecnologias}
          onSubmit={handleGuardar}
          onCancel={cerrar}
        />
      </Modal>
    </section>
  );
}
