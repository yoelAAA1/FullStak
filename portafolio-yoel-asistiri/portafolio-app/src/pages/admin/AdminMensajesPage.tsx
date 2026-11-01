// src/pages/admin/AdminMensajesPage.tsx — bandeja de entrada
// Ruta: /admin/mensajes

import { useState } from 'react';
import { Inbox } from 'lucide-react';
import type { Mensaje } from '../../interfaces/Mensaje';
import { useMensajes } from '../../hooks/useMensajes';
import MensajesTable from '../../components/tables/MensajesTable';
import EstadoCarga from '../../components/ui/EstadoCarga';

export default function AdminMensajesPage() {
  const [soloNuevos, setSoloNuevos] = useState(true);   // checkbox "solo no leídos" marcado al inicio
  const { mensajes, loading, error, cambiarLeido, eliminar } = useMensajes(soloNuevos);
  const [accionError, setAccionError] = useState<string | null>(null);

  // Ejecuta cualquier acción async y muestra el error si falla (evita repetir try/catch)
  const ejecutar = async (accion: () => Promise<void>) => {
    try {
      setAccionError(null);
      await accion();
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  const handleEliminar = (mensaje: Mensaje) => {
    if (!confirm(`¿Eliminar el mensaje de ${mensaje.nombre}?`)) return;
    ejecutar(() => eliminar(mensaje.id));
  };

  return (
    <section className="panel">
      <label className="casilla">
        <input type="checkbox" checked={soloNuevos} onChange={(e) => setSoloNuevos(e.target.checked)} />
        Mostrar solo los no leídos
      </label>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga
        loading={loading}
        error={error}
        vacio={mensajes.length === 0}
        icon={Inbox}
        textoVacio={soloNuevos ? 'No hay mensajes nuevos.' : 'Todavía no llegó ningún mensaje.'}
      />
      {!loading && mensajes.length > 0 && (
        <MensajesTable
          mensajes={mensajes}
          onCambiarLeido={(m) => ejecutar(() => cambiarLeido(m.id, !m.leido))}   // invierte leido
          onEliminar={handleEliminar}
        />
      )}
    </section>
  );
}
