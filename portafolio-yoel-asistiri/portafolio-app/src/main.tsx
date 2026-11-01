// src/main.tsx — PUNTO DE ENTRADA: lo carga index.html y monta React en <div id="root">

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';   // estilos globales PRIMERO, para que las variables :root existan

// document.getElementById('root')! → el "!" le asegura a TypeScript que el div existe
createRoot(document.getElementById('root')!).render(
  // StrictMode: en desarrollo ejecuta los efectos dos veces para detectar errores
  <StrictMode>
    <App />
  </StrictMode>,
);
