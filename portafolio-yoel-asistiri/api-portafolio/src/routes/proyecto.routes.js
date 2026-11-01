// src/routes/proyecto.routes.js — define QUÉ URL ejecuta QUÉ función
// Los comentarios que empiezan con @swagger los lee swagger-jsdoc para armar la documentación en /api-docs.

// Router: un "mini servidor" de Express para agrupar rutas. En app.js se monta en /api/proyectos
const router = require('express').Router();

// Controlador con la lógica de cada endpoint
const ctrl = require('../controllers/proyecto.controller');

// Middleware de la clave de administrador
const requireAdmin = require('../middlewares/auth');

// Middlewares de validación
const { validarId, validarProyecto } = require('../middlewares/validar');

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Listar proyectos (con filtros opcionales)
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema: { type: string, enum: [FRONTEND, BACKEND, FULLSTACK] }
 *         description: Filtrar por categoría (acepta minúsculas)
 *       - in: query
 *         name: tecnologia
 *         schema: { type: string, example: React }
 *         description: Filtrar por nombre de tecnología
 *       - in: query
 *         name: destacado
 *         schema: { type: boolean }
 *         description: Solo proyectos destacados
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Proyecto' }
 *       400:
 *         description: Filtro inválido
 */
// GET /api/proyectos → público, sin validaciones extra
router.get('/', ctrl.obtenerTodos);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proyecto' }
 *       400: { description: Id inválido }
 *       404: { description: Proyecto no encontrado }
 */
// GET /api/proyectos/:id → primero validarId, luego el controlador
router.get('/:id', validarId, ctrl.obtenerPorId);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CrearProyecto' }
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proyecto' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: Falta la API key o es incorrecta }
 */
// POST /api/proyectos → los middlewares se ejecutan en orden: clave → validación → controlador
router.post('/', requireAdmin, validarProyecto, ctrl.crear);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Reemplazar un proyecto completo
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CrearProyecto' }
 *     responses:
 *       200: { description: Proyecto actualizado }
 *       400: { description: Datos inválidos }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Proyecto no encontrado }
 */
router.put('/:id', requireAdmin, validarId, validarProyecto, ctrl.actualizar);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204: { description: Proyecto eliminado }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Proyecto no encontrado }
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

// Exportamos el router para montarlo en app.js
module.exports = router;
