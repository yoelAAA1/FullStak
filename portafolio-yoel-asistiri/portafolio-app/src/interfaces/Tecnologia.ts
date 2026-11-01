// src/interfaces/Tecnologia.ts — forma de una tecnología tal como la devuelve la API

// Unión de literales: solo estos 4 textos son válidos (igual que el enum de Prisma)
// Se usa "type" en vez de "enum" porque la plantilla de Vite activa erasableSyntaxOnly
export type AreaTecnologia = 'FRONTEND' | 'BACKEND' | 'BASE_DATOS' | 'HERRAMIENTA';

// Lo que RECIBIMOS de la API
export interface Tecnologia {
  id: number;
  nombre: string;
  area: AreaTecnologia;
  _count?: { proyectos: number }; // "?" = opcional: solo viene en GET /tecnologias
}

// DTO (Data Transfer Object) = lo que ENVIAMOS en POST y PUT (sin id: lo genera la base)
export interface TecnologiaDTO {
  nombre: string;
  area: AreaTecnologia;
}
