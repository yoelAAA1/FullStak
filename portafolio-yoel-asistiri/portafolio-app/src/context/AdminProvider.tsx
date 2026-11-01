// src/context/AdminProvider.tsx — guarda la sesión de admin y la comparte con toda la app

import { useState, type ReactNode } from 'react';
import { CLAVE_ADMIN } from '../api/axiosInstance';
import { mensajeService } from '../services/mensajeService';
import { AdminContext } from './adminContext';

// children = todo lo que va DENTRO de <AdminProvider> ... </AdminProvider>
export default function AdminProvider({ children }: { children: ReactNode }) {
  // Estado inicial: hay sesión si la clave sigue guardada (sobrevive a recargar la pestaña)
  // La función dentro de useState solo se ejecuta la primera vez
  const [esAdmin, setEsAdmin] = useState(() => sessionStorage.getItem(CLAVE_ADMIN) !== null);

  // Iniciar sesión: la API no tiene endpoint de login, así que probamos la clave con una ruta protegida
  const ingresar = async (clave: string) => {
    sessionStorage.setItem(CLAVE_ADMIN, clave);  // la guardamos para que el interceptor la envíe
    try {
      await mensajeService.getAll();             // GET /mensajes requiere x-api-key
      setEsAdmin(true);                          // si respondió bien, la clave es correcta
    } catch (err) {
      sessionStorage.removeItem(CLAVE_ADMIN);    // 401: clave incorrecta → la borramos
      throw err;                                 // y avisamos al LoginPage para que muestre el error
    }
  };

  // Cerrar sesión
  const salir = () => {
    sessionStorage.removeItem(CLAVE_ADMIN);
    setEsAdmin(false);
  };

  // En React 19 el contexto se usa directamente como proveedor (antes era <AdminContext.Provider>)
  return <AdminContext value={{ esAdmin, ingresar, salir }}>{children}</AdminContext>;
}
