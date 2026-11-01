// src/services/tecnologiaService.ts — llamadas a /tecnologias

import axiosInstance from '../api/axiosInstance';
import type { AreaTecnologia, Tecnologia, TecnologiaDTO } from '../interfaces/Tecnologia';

export const tecnologiaService = {
  // GET /tecnologias?area=...  (si area es undefined, axios no la envía)
  getAll: async (area?: AreaTecnologia): Promise<Tecnologia[]> => {
    const { data } = await axiosInstance.get<Tecnologia[]>('/tecnologias', { params: { area } });
    return data;
  },

  // POST /tecnologias
  create: async (payload: TecnologiaDTO): Promise<Tecnologia> => {
    const { data } = await axiosInstance.post<Tecnologia>('/tecnologias', payload);
    return data;
  },

  // PUT /tecnologias/:id
  update: async (id: number, payload: TecnologiaDTO): Promise<Tecnologia> => {
    const { data } = await axiosInstance.put<Tecnologia>(`/tecnologias/${id}`, payload);
    return data;
  },

  // DELETE /tecnologias/:id
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tecnologias/${id}`);
  },
};
