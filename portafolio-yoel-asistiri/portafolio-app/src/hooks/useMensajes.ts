// src/hooks/useMensajes.ts — bandeja de entrada del admin

import { useEffect, useState } from 'react';
import { mensajeService } from '../services/mensajeService';
import type { Mensaje } from '../interfaces/Mensaje';

// soloNuevos = true → solo los no leídos
export const useMensajes = (soloNuevos: boolean) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargadoPara, setCargadoPara] = useState<boolean | null>(null);

  // Se vuelve a ejecutar cada vez que cambia el checkbox "solo no leídos"
  useEffect(() => {
    let cancelado = false;

    mensajeService
      .getAll(soloNuevos)
      .then((datos) => {
        if (cancelado) return;
        setMensajes(datos);
        setError(null);
      })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setCargadoPara(soloNuevos); });

    return () => { cancelado = true; };
  }, [soloNuevos]);

  // Cargando mientras los datos no sean del filtro actual
  const loading = cargadoPara !== soloNuevos;

  // Marcar leído / no leído
  const cambiarLeido = async (id: number, leido: boolean) => {
    const actualizado = await mensajeService.marcarLeido(id, leido);
    setMensajes((prev) =>
      soloNuevos && leido
        ? prev.filter((m) => m.id !== id)                     // ya no es "nuevo": sale de la lista
        : prev.map((m) => (m.id === id ? actualizado : m)),   // si no, solo se actualiza
    );
  };

  const eliminar = async (id: number) => {
    await mensajeService.remove(id);
    setMensajes((prev) => prev.filter((m) => m.id !== id));
  };

  return { mensajes, loading, error, cambiarLeido, eliminar };
};
