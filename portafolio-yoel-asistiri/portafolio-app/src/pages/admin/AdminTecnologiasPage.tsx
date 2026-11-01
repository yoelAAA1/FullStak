// src/pages/admin/AdminTecnologiasPage.tsx — CRUD de tecnologías
// Ruta: /admin/tecnologias

import { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import type { Tecnologia, TecnologiaDTO } from '../../interfaces/Tecnologia';
import { useTecnologias } from '../../hooks/useTecnologias';
import TecnologiaForm from '../../components/forms/TecnologiaForm';
import TecnologiasTable from '../../components/tables/TecnologiasTable';
import Button from '../../components/ui/Button';
import EstadoCarga from '../../components/ui/EstadoCarga';
import Modal from '../../components/ui/Modal';

// undefined = cerrado · null = crear · Tecnologia = editar
type Edicion = Tecnologia | null | undefined;

export default function AdminTecnologiasPage() {
  const { tecnologias, loading, error, crear, actualizar, eliminar } = useTecnologias();
  const [edicion, setEdicion] = useState<Edicion>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [accionError, setAccionError] = useState<string | null>(null);

  const abrir = (tecnologia: Tecnologia | null) => {
    setFormError(null);
    setEdicion(tecnologia);
  };
  const cerrar = () => setEdicion(undefined);

  const handleGuardar = async (data: TecnologiaDTO) => {
    try {
      setFormError(null);
      if (edicion) await actualizar(edicion.id, data);
      else await crear(data);
      cerrar();
    } catch (err) {
      setFormError((err as Error).message);   // ej.: 409 "Ya existe un registro con ese valor único"
    }
  };

  const handleEliminar = async (tecnologia: Tecnologia) => {
    const usos = tecnologia._count?.proyectos ?? 0;
    const aviso = usos ? ` Se quitará de ${usos} proyecto(s).` : '';
    if (!confirm(`¿Eliminar "${tecnologia.nombre}"?${aviso}`)) return;
    try {
      setAccionError(null);
      await eliminar(tecnologia.id);
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  return (
    <section className="panel">
      <div className="panel__barra">
        <p className="texto-suave">{tecnologias.length} tecnología(s)</p>
        <Button onClick={() => abrir(null)} icon={<Plus size={16} />}>Nueva tecnología</Button>
      </div>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga loading={loading} error={error} vacio={tecnologias.length === 0} icon={Layers} textoVacio="Crea la primera tecnología." />
      {!loading && tecnologias.length > 0 && (
        <TecnologiasTable tecnologias={tecnologias} onEditar={abrir} onEliminar={handleEliminar} />
      )}

      <Modal open={edicion !== undefined} onClose={cerrar} title={edicion ? 'Editar tecnología' : 'Nueva tecnología'}>
        {formError && <p role="alert" className="alerta alerta--error">{formError}</p>}
        <TecnologiaForm key={edicion?.id ?? 'nueva'} tecnologia={edicion ?? undefined} onSubmit={handleGuardar} onCancel={cerrar} />
      </Modal>
    </section>
  );
}
