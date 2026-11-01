// src/hooks/useTecnologias.ts — pide las tecnologías y ofrece crear/actualizar/eliminar

import { useEffect, useState } from 'react';
import { tecnologiaService } from '../services/tecnologiaService';
import type { Tecnologia, TecnologiaDTO } from '../interfaces/Tecnologia';

export const useTecnologias = () => {
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);            // empieza cargando

  // Array de dependencias vacío [] → se ejecuta UNA sola vez al montar el componente
  useEffect(() => {
    let cancelado = false;

    tecnologiaService
      .getAll()
      .then((datos) => { if (!cancelado) setTecnologias(datos); })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setLoading(false); });

    return () => { cancelado = true; };
  }, []);

  // Crear: la API no devuelve _count en el POST, así que lo agregamos en 0
  const crear = async (payload: TecnologiaDTO) => {
    const nueva = await tecnologiaService.create(payload);
    setTecnologias((prev) => [...prev, { ...nueva, _count: { proyectos: 0 } }]);
  };

  // Actualizar: mezclamos lo viejo (conserva _count) con lo nuevo
  const actualizar = async (id: number, payload: TecnologiaDTO) => {
    const actualizada = await tecnologiaService.update(id, payload);
    setTecnologias((prev) => prev.map((t) => (t.id === id ? { ...t, ...actualizada } : t)));
  };

  const eliminar = async (id: number) => {
    await tecnologiaService.remove(id);
    setTecnologias((prev) => prev.filter((t) => t.id !== id));
  };

  return { tecnologias, loading, error, crear, actualizar, eliminar };
};
