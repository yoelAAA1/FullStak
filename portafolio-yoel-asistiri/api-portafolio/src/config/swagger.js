// src/config/swagger.js — documentación interactiva de la API (OpenAPI 3.0)

// swagger-jsdoc: lee los comentarios @swagger de las rutas y arma la especificación
const swaggerJsdoc = require('swagger-jsdoc');
// swagger-ui-express: dibuja la página web interactiva a partir de esa especificación
const swaggerUi = require('swagger-ui-express');

// Valores de los enums (los repetimos en varios esquemas)
const CATEGORIAS = ['FRONTEND', 'BACKEND', 'FULLSTACK'];
const AREAS = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'];

const options = {
  definition: {
    openapi: '3.0.0',                                   // versión del estándar OpenAPI
    info: {
      title: 'API Portafolio – Yoel Americo Agner Asistiri', // título que se ve arriba en /api-docs
      version: '1.0.0',
      description: 'API REST del portafolio: proyectos, tecnologías y mensajes de contacto',
    },
    servers: [
      // Servidor contra el que Swagger hace las pruebas ("Try it out")
      { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Servidor de desarrollo' },
    ],
    tags: [
      // Grupos que se ven en la página
      { name: 'Proyectos', description: 'Tarjetas de la sección "Proyectos"' },
      { name: 'Tecnologías', description: 'Sección "Habilidades" y etiquetas de cada proyecto' },
      { name: 'Mensajes', description: 'Formulario de contacto' },
    ],
    components: {
      // Botón "Authorize": escribes la clave una vez y se envía en el header x-api-key
      securitySchemes: {
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      // Parámetro reutilizable {id} en la URL
      parameters: {
        Id: { in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } },
      },
      // Forma de los objetos (lo que entra y sale)
      schemas: {
        Tecnologia: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'React' },
            area: { type: 'string', enum: AREAS },
          },
        },
        CrearTecnologia: {
          type: 'object',
          required: ['nombre', 'area'],
          properties: {
            nombre: { type: 'string', example: 'Vue' },
            area: { type: 'string', enum: AREAS },
          },
        },
        Proyecto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'App de Tareas' },
            descripcion: { type: 'string', example: 'Aplicación web con drag & drop y modo oscuro.' },
            emoji: { type: 'string', example: '📱' },
            categoria: { type: 'string', enum: CATEGORIAS },
            urlDemo: { type: 'string', nullable: true, example: 'https://demo.ejemplo.com' },
            urlRepo: { type: 'string', nullable: true, example: 'https://github.com/yoel/app-tareas' },
            destacado: { type: 'boolean', example: true },
            creadoEn: { type: 'string', format: 'date-time' },
            actualizadoEn: { type: 'string', format: 'date-time' },
            tecnologias: { type: 'array', items: { $ref: '#/components/schemas/Tecnologia' } },
          },
        },
        CrearProyecto: {
          type: 'object',
          required: ['titulo', 'descripcion', 'categoria'],
          properties: {
            titulo: { type: 'string', example: 'App de Tareas' },
            descripcion: { type: 'string', example: 'Aplicación web con drag & drop y modo oscuro.' },
            emoji: { type: 'string', example: '📱' },
            categoria: { type: 'string', enum: CATEGORIAS },
            urlDemo: { type: 'string', example: 'https://demo.ejemplo.com' },
            urlRepo: { type: 'string', example: 'https://github.com/yoel/app-tareas' },
            destacado: { type: 'boolean', example: false },
            tecnologiaIds: { type: 'array', items: { type: 'integer' }, example: [1, 2] },
          },
        },
        Mensaje: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ana García' },
            email: { type: 'string', example: 'ana@email.com' },
            servicio: { type: 'string', nullable: true, example: 'Desarrollo Web Full Stack' },
            presupuesto: { type: 'integer', nullable: true, example: 1500 },
            fecha: { type: 'string', format: 'date', nullable: true },
            mensaje: { type: 'string', example: 'Hola Yoel, necesito una página web para mi negocio.' },
            leido: { type: 'boolean', example: false },
            creadoEn: { type: 'string', format: 'date-time' },
          },
        },
        CrearMensaje: {
          type: 'object',
          required: ['nombre', 'email', 'mensaje'],
          properties: {
            nombre: { type: 'string', example: 'Ana García' },
            email: { type: 'string', example: 'ana@email.com' },
            servicio: { type: 'string', example: 'Desarrollo Web Full Stack' },
            presupuesto: { type: 'integer', example: 1500 },
            fecha: { type: 'string', format: 'date', example: '2026-11-15' },
            mensaje: { type: 'string', example: 'Hola Yoel, necesito una página web para mi negocio.' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Datos inválidos' },
            detalles: { type: 'array', items: { type: 'string' }, example: ['email no es válido'] },
          },
        },
      },
    },
  },
  // Archivos donde swagger-jsdoc busca los comentarios @swagger
  apis: ['./src/routes/*.js'],
};

// Generamos la especificación una sola vez al arrancar
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
