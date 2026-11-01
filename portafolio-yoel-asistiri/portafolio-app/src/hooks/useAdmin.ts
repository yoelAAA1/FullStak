// src/hooks/useAdmin.ts — atajo para leer el contexto de admin
// Uso en cualquier componente:  const { esAdmin, salir } = useAdmin();

import { useContext } from 'react';
import { AdminContext } from '../context/adminContext';

export const useAdmin = () => {
  const contexto = useContext(AdminContext);               // lee el valor del Provider más cercano
  if (!contexto) throw new Error('useAdmin debe usarse dentro de <AdminProvider>');
  return contexto;                                         // { esAdmin, ingresar, salir }
};
