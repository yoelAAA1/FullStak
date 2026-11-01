// src/hooks/usePaginacion.ts — divide cualquier lista en páginas
// <T> = genérico: funciona con Proyecto[], Tecnologia[], Mensaje[]...

import { useMemo, useState } from 'react';

export function usePaginacion<T>(datos: T[], porPaginaInicial = 5) {
  const [porPagina, setPorPagina] = useState(porPaginaInicial); // filas por página
  const [pagina, setPagina] = useState(1);                      // página elegida

  // Total de páginas (mínimo 1 aunque la lista esté vacía)
  const totalPaginas = Math.max(1, Math.ceil(datos.length / porPagina));

  // Si se borran filas y la página elegida ya no existe, usamos la última que sí existe
  const paginaActual = Math.min(pagina, totalPaginas);

  // useMemo: recalcula el recorte solo cuando cambian datos, página o tamaño
  const datosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;   // página 2 de 5 → empieza en el índice 5
    return datos.slice(inicio, inicio + porPagina);  // slice no modifica el array original
  }, [datos, paginaActual, porPagina]);

  // Ir a una página sin salirse del rango 1..totalPaginas
  const irA = (p: number) => setPagina(Math.min(Math.max(1, p), totalPaginas));

  // Cambiar cuántas filas se ven y volver a la página 1
  const cambiarPorPagina = (n: number) => {
    setPorPagina(n);
    setPagina(1);
  };

  return {
    datosPagina,
    paginaActual,
    totalPaginas,
    desde: datos.length === 0 ? 0 : (paginaActual - 1) * porPagina + 1, // "6–10 de 23"
    hasta: Math.min(paginaActual * porPagina, datos.length),
    total: datos.length,
    porPagina,
    irA,
    cambiarPorPagina,
  };
}
