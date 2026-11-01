// src/components/tables/MensajesTable.tsx — lista de mensajes del panel admin

import { Mail, MailOpen, Trash2 } from 'lucide-react';
import type { Mensaje } from '../../interfaces/Mensaje';
import { usePaginacion } from '../../hooks/usePaginacion';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  mensajes: Mensaje[];
  onCambiarLeido: (mensaje: Mensaje) => void;
  onEliminar: (mensaje: Mensaje) => void;
}

// Formatea una fecha ISO a "31/10/2026".
// utc = true para campos de SOLO fecha: "2026-11-15T00:00:00Z" en Bolivia (UTC-4) se vería como el día 14
const fecha = (iso: string, utc = false) =>
  new Date(iso).toLocaleDateString('es-BO', utc ? { timeZone: 'UTC' } : undefined);

export default function MensajesTable({ mensajes, onCambiarLeido, onEliminar }: Props) {
  const { datosPagina, ...paginacion } = usePaginacion(mensajes);

  return (
    <div className="mensajes tarjeta">
      <ul>
        {datosPagina.map((m) => (
          // Los no leídos llevan el modificador mensaje--nuevo
          <li key={m.id} className={m.leido ? 'mensaje' : 'mensaje mensaje--nuevo'}>
            <div className="mensaje__cabecera">
              <div>
                <p className="mensaje__nombre">{m.nombre}</p>
                {/* mailto: abre el programa de correo para responder */}
                <a href={`mailto:${m.email}`} className="mensaje__email">{m.email}</a>
              </div>
              <span className="mensaje__fecha">{fecha(m.creadoEn)}</span>
            </div>
            <p className="mensaje__texto">{m.mensaje}</p>
            <p className="mensaje__meta">
              {m.servicio ?? 'Sin servicio'} · {m.presupuesto ? `$${m.presupuesto.toLocaleString('es-BO')}` : 'Sin presupuesto'}
              {m.fecha && ` · Contactar el ${fecha(m.fecha, true)}`}
            </p>
            <div className="tabla__acciones">
              <Button
                variant="ghost"
                onClick={() => onCambiarLeido(m)}
                icon={m.leido ? <Mail size={14} /> : <MailOpen size={14} />}
              >
                {m.leido ? 'Marcar como no leído' : 'Marcar como leído'}
              </Button>
              <Button variant="danger" onClick={() => onEliminar(m)} icon={<Trash2 size={14} />}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination {...paginacion} />
    </div>
  );
}
