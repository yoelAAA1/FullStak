// src/components/ui/EstadoCarga.tsx — muestra "Cargando...", el error o el estado vacío

import type { LucideIcon } from 'lucide-react';   // tipo de un ícono de lucide
import './EstadoCarga.css';

interface Props {
  loading: boolean;
  error: string | null;
  vacio: boolean;
  icon: LucideIcon;
  textoVacio: string;
}

// "icon: Icon" renombra la prop: los componentes en JSX deben empezar con MAYÚSCULA
export default function EstadoCarga({ loading, error, vacio, icon: Icon, textoVacio }: Props) {
  // 1) Cargando
  if (loading) {
    return <p className="estado-carga estado-carga--cargando">Cargando...</p>;
  }
  // 2) Error (role="alert" hace que el lector de pantalla lo anuncie)
  if (error) {
    return <p role="alert" className="alerta alerta--error">{error}</p>;
  }
  // 3) Lista vacía
  if (vacio) {
    return (
      <div className="estado-carga">
        <Icon size={32} />
        <p>{textoVacio}</p>
      </div>
    );
  }
  // 4) Hay datos: no mostramos nada (los dibuja el componente padre)
  return null;
}
