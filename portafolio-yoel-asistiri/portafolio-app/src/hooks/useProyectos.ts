// src/hooks/useProyectos.ts — custom hook: pide los proyectos y ofrece crear/actualizar/eliminar
// Un "custom hook" es una función que empieza con "use" y usa otros hooks de React.

import { useEffect, useState } from 'react';
import { proyectoService } from '../services/proyectoService';
import type { FiltrosProyecto, Proyecto, ProyectoDTO } from '../interfaces/Proyecto';

export const useProyectos = (filtros: FiltrosProyecto = {}) => {
  // Separamos los filtros en variables simples (sirven como dependencias del efecto)
  const { categoria, tecnologia, destacado } = filtros;

  // Estados: la lista, el error y "para qué filtros" son los datos actuales
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargadoPara, setCargadoPara] = useState<string | null>(null);

  // Texto que identifica la combinación de filtros actual: "FRONTEND|undefined|undefined"
  const clave = `${categoria}|${tecnologia}|${destacado}`;

  // useEffect: se ejecuta después de dibujar y cada vez que cambia algo del array de dependencias
  useEffect(() => {
    // Bandera: si cambian los filtros antes de que llegue la respuesta, la ignoramos
    let cancelado = false;

    proyectoService
      .getAll({ categoria, tecnologia, destacado })            // pide a la API
      .then((datos) => {
        if (cancelado) return;                                 // respuesta vieja: no hacemos nada
        setProyectos(datos);                                   // guardamos la lista
        setError(null);                                        // limpiamos errores anteriores
      })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setCargadoPara(clave); }); // estos datos son para "clave"

    // Función de limpieza: React la ejecuta antes del siguiente efecto o al desmontar
    return () => { cancelado = true; };
  }, [categoria, tecnologia, destacado, clave]);

  // Está cargando mientras los datos no correspondan a los filtros actuales
  const loading = cargadoPara !== clave;

  // Crear: pide a la API y agrega el nuevo AL INICIO sin volver a pedir toda la lista
  const crear = async (payload: ProyectoDTO) => {
    const nuevo = await proyectoService.create(payload);
    setProyectos((prev) => [nuevo, ...prev]);
  };

  // Actualizar: reemplaza solo el proyecto que cambió
  const actualizar = async (id: number, payload: ProyectoDTO) => {
    const actualizado = await proyectoService.update(id, payload);
    setProyectos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
  };

  // Eliminar: lo quita de la lista
  const eliminar = async (id: number) => {
    await proyectoService.remove(id);
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  // Lo que el componente puede usar
  return { proyectos, loading, error, crear, actualizar, eliminar };
};
