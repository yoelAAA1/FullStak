// src/context/adminContext.ts — "caja compartida" con la sesión de administrador
// El contexto permite que cualquier componente lea esAdmin sin pasarlo por props de padre a hijo.

import { createContext } from 'react';

// Qué contiene el contexto
export interface AdminContextValue {
  esAdmin: boolean;                          // ¿hay sesión iniciada?
  ingresar: (clave: string) => Promise<void>; // prueba la clave contra la API
  salir: () => void;                         // cierra la sesión
}

// Valor por defecto null: si alguien lo usa fuera del Provider, useAdmin() lanza un aviso
export const AdminContext = createContext<AdminContextValue | null>(null);
