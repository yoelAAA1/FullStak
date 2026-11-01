// src/services/mensajeService.ts — llamadas a /mensajes

import axiosInstance from '../api/axiosInstance';
import type { Mensaje, MensajeDTO, MensajeEnviado } from '../interfaces/Mensaje';

export const mensajeService = {
  // PÚBLICO: el formulario de contacto envía el mensaje
  enviar: async (payload: MensajeDTO): Promise<MensajeEnviado> => {
    const { data } = await axiosInstance.post<MensajeEnviado>('/mensajes', payload);
    return data;
  },

  // ADMIN: bandeja de entrada. soloNuevos = true → GET /mensajes?leido=false
  getAll: async (soloNuevos = false): Promise<Mensaje[]> => {
    const params = soloNuevos ? { leido: false } : undefined;
    const { data } = await axiosInstance.get<Mensaje[]>('/mensajes', { params });
    return data;
  },

  // ADMIN: PATCH cambia solo el campo leido
  marcarLeido: async (id: number, leido: boolean): Promise<Mensaje> => {
    const { data } = await axiosInstance.patch<Mensaje>(`/mensajes/${id}`, { leido });
    return data;
  },

  // ADMIN: borrar
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/mensajes/${id}`);
  },
};
