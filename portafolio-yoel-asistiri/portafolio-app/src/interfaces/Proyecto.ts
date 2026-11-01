// src/interfaces/Proyecto.ts — forma de un proyecto

// "import type": solo importa el TIPO (desaparece al compilar a JavaScript)
import type { Tecnologia } from './Tecnologia';

// Las 3 categorías posibles
export type Categoria = 'FRONTEND' | 'BACKEND' | 'FULLSTACK';

// Lo que RECIBIMOS de la API
export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  emoji: string;
  categoria: Categoria;
  urlDemo: string | null;          // la API devuelve null si está vacío
  urlRepo: string | null;
  destacado: boolean;
  creadoEn: string;                // las fechas llegan como texto ISO: "2026-10-31T20:00:00.000Z"
  actualizadoEn: string;
  tecnologias: Omit<Tecnologia, '_count'>[]; // Omit = el mismo tipo SIN la propiedad _count
}

// Lo que ENVIAMOS en POST y PUT ("?" = opcional)
export interface ProyectoDTO {
  titulo: string;
  descripcion: string;
  emoji?: string;
  categoria: Categoria;
  urlDemo?: string;
  urlRepo?: string;
  destacado?: boolean;
  tecnologiaIds?: number[];
}

// Filtros de GET /proyectos → ?categoria=...&tecnologia=...&destacado=...
export interface FiltrosProyecto {
  categoria?: Categoria;
  tecnologia?: string;
  destacado?: boolean;
}
