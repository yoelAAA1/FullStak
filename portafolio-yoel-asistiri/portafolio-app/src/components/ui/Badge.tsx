// src/components/ui/Badge.tsx — etiqueta (categoría o tecnología)

import type { ReactNode } from 'react';
import './Badge.css';

interface Props {
  children: ReactNode;
  variante?: string;   // por ejemplo "frontend" → clase badge--frontend
}

export default function Badge({ children, variante }: Props) {
  // Operador ternario: con variante agrega el modificador; sin variante, solo "badge"
  return <span className={variante ? `badge badge--${variante}` : 'badge'}>{children}</span>;
}
