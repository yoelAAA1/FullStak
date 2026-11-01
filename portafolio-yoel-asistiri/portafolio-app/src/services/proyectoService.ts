// src/services/proyectoService.ts — TODAS las llamadas a /proyectos están aquí
// Los componentes nunca usan axios directo: llaman a estas funciones.

import axiosInstance from '../api/axiosInstance';
import type { FiltrosProyecto, Proyecto, ProyectoDTO } from '../interfaces/Proyecto';

export const proyectoService = {
  // GET /proyectos?categoria=...  → Promise<Proyecto[]> = "promesa que devuelve un array de proyectos"
  getAll: async (filtros?: FiltrosProyecto): Promise<Proyecto[]> => {
    // params: axios arma el query string y OMITE las propiedades undefined
    // { data } = destructuring: de la respuesta solo nos interesa el cuerpo
    const { data } = await axiosInstance.get<Proyecto[]>('/proyectos', { params: filtros });
    return data;
  },

  // GET /proyectos/3
  getById: async (id: number): Promise<Proyecto> => {
    const { data } = await axiosInstance.get<Proyecto>(`/proyectos/${id}`);
    return data;
  },

  // POST /proyectos (el interceptor agrega la x-api-key)
  create: async (payload: ProyectoDTO): Promise<Proyecto> => {
    const { data } = await axiosInstance.post<Proyecto>('/proyectos', payload);
    return data;
  },

  // PUT /proyectos/3
  update: async (id: number, payload: ProyectoDTO): Promise<Proyecto> => {
    const { data } = await axiosInstance.put<Proyecto>(`/proyectos/${id}`, payload);
    return data;
  },

  // DELETE /proyectos/3 (responde 204 sin cuerpo → Promise<void>)
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/proyectos/${id}`);
  },
};
