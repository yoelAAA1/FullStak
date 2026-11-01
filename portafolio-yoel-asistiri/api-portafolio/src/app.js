// src/app.js — punto de entrada de la API del portafolio de Yoel Americo Agner Asistiri
// Se ejecuta con:  npm run dev   (o  npm start)

// 1) Cargar el .env PRIMERO: lib/prisma.js necesita DATABASE_URL. quiet evita un mensaje en consola
require('dotenv').config({ quiet: true });

// 2) Librerías
const express = require('express');   // framework para crear el servidor HTTP
const cors = require('cors');         // permite que React (otro puerto) llame a la API

// 3) Documentación Swagger
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// 4) Rutas de cada recurso
const proyectoRoutes = require('./routes/proyecto.routes');
const tecnologiaRoutes = require('./routes/tecnologia.routes');
const mensajeRoutes = require('./routes/mensaje.routes');

// 5) Middleware que atrapa los errores
const errorHandler = require('./middlewares/errorHandler');

// Creamos la aplicación de Express
const app = express();

// Puerto del .env o 3000 si no existe
const PORT = process.env.PORT || 3000;

// Ruta de la documentación del .env o /api-docs
const DOCS = process.env.DOCUMENTATION || '/api-docs';

// ---------------- Middlewares globales (se ejecutan en TODAS las peticiones) ----------------

// CORS: solo los orígenes de CORS_ORIGIN pueden hacer fetch desde el navegador.
// "a,b".split(',') → ['a', 'b']. Si no existe la variable, se permite cualquiera ('*')
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));

// Convierte el body JSON de la petición en el objeto req.body
app.use(express.json());

// ---------------- Rutas ----------------

// Documentación interactiva → http://localhost:3000/api-docs
app.use(DOCS, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Cada router se "monta" en su prefijo: dentro del router, '/' significa '/api/proyectos'
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tecnologias', tecnologiaRoutes);
app.use('/api/mensajes', mensajeRoutes);

// Health check: para comprobar rápido que el servidor está vivo → http://localhost:3000/health
app.get('/health', (req, res) => res.json({ status: 'ok', autor: 'Yoel Americo Agner Asistiri' }));

// Raíz: un pequeño mapa de la API → http://localhost:3000/
app.get('/', (req, res) =>
  res.json({
    api: 'Portafolio de Yoel Americo Agner Asistiri',
    documentacion: DOCS,
    endpoints: ['/api/proyectos', '/api/tecnologias', '/api/mensajes', '/health'],
  }),
);

// 404: se ejecuta solo si NINGUNA ruta anterior respondió
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejo de errores: SIEMPRE al final
app.use(errorHandler);

// ---------------- Encender el servidor ----------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}${DOCS}`);
});
