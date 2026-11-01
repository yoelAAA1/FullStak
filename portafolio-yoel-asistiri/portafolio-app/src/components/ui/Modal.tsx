// src/components/ui/Modal.tsx — ventana emergente para los formularios del panel

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';   // ícono de cerrar
import './Modal.css';

interface Props {
  open: boolean;            // ¿se muestra?
  onClose: () => void;      // función para cerrarlo
  title: string;            // título de la cabecera
  children: ReactNode;      // contenido (el formulario)
}

export default function Modal({ open, onClose, title, children }: Props) {
  // Cerrar con la tecla Escape, solo mientras el modal está abierto
  useEffect(() => {
    if (!open) return;                                                // cerrado: no escuchamos nada
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);                    // empezamos a escuchar
    return () => document.removeEventListener('keydown', handler);    // limpieza: dejamos de escuchar
  }, [open, onClose]);

  // Si está cerrado, no dibujamos nada
  if (!open) return null;

  return (
    // Clic en el fondo oscuro → cierra
    <div className="modal" onClick={onClose}>
      <div
        role="dialog"                          // accesibilidad: es un diálogo
        aria-modal="true"
        aria-label={title}
        className="modal__caja"
        onClick={(e) => e.stopPropagation()}   // un clic DENTRO no llega al fondo → no cierra
      >
        <div className="modal__cabecera">
          <h2 className="modal__titulo">{title}</h2>
          <button onClick={onClose} className="modal__cerrar" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}
