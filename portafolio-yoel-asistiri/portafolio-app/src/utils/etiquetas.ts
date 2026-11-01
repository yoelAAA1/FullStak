// src/utils/etiquetas.ts — textos en pantalla y datos personales de Yoel

import type { Categoria } from "../interfaces/Proyecto";
import type { AreaTecnologia } from "../interfaces/Tecnologia";

// ---------------------------------------------------------------
// Datos personales: cámbialos aquí y se actualizan en toda la app
// ---------------------------------------------------------------
export const PERFIL = {
  nombreCompleto: "Yoel Americo Agner Asistiri",
  nombreCorto: "Yoel Asistiri",
  rol: "Desarrollador Full Stack",
  ubicacion: "La Paz-Bolivia",
  email: "americoyoel1@gmail.com",
};

export const CATEGORIAS: Record<Categoria, string> = {
  FRONTEND: "Front-End",
  BACKEND: "Back-End",
  FULLSTACK: "Full Stack",
};

// Texto de cada área de tecnología
export const AREAS: Record<AreaTecnologia, string> = {
  FRONTEND: "Front-End",
  BACKEND: "Back-End",
  BASE_DATOS: "Bases de Datos",
  HERRAMIENTA: "Herramientas",
};

// Opciones del select "Tipo de servicio" del formulario de contacto
export const SERVICIOS = [
  "Desarrollo Web Full Stack",
  "API REST / Back-End",
  "Diseño UI / Front-End",
  "Base de Datos",
  "Consultoría Técnica",
];

// Object.keys devuelve string[]; con "as" le decimos a TypeScript qué claves son exactamente
export const LISTA_CATEGORIAS = Object.keys(CATEGORIAS) as Categoria[];
export const LISTA_AREAS = Object.keys(AREAS) as AreaTecnologia[];
