// src/routes/tecnologia.routes.js — rutas de /api/tecnologias

const router = require('express').Router();                                // agrupador de rutas
const ctrl = require('../controllers/tecnologia.controller');              // lógica
const requireAdmin = require('../middlewares/auth');                       // clave de admin
const { validarId, validarTecnologia } = require('../middlewares/validar'); // validaciones

/**
 * @swagger
 * /api/tecnologias:
 *   get:
 *     summary: Listar tecnologías (con cuántos proyectos usan cada una)
 *     tags: [Tecnologías]
 *     parameters:
 *       - in: query
 *         name: area
 *         schema: { type: string, enum: [FRONTEND, BACKEND, BASE_DATOS, HERRAMIENTA] }
 *     responses:
 *       200:
 *         description: Lista de tecnologías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Tecnologia' }
 */
router.get('/', ctrl.obtenerTodas);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   get:
 *     summary: Obtener una tecnología y los proyectos que la usan
 *     tags: [Tecnologías]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200: { description: Tecnología encontrada }
 *       404: { description: Tecnología no encontrada }
 */
router.get('/:id', validarId, ctrl.obtenerPorId);

/**
 * @swagger
 * /api/tecnologias:
 *   post:
 *     summary: Crear una tecnología
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CrearTecnologia' }
 *     responses:
 *       201: { description: Tecnología creada }
 *       400: { description: Datos inválidos }
 *       401: { description: Falta la API key o es incorrecta }
 *       409: { description: Ya existe una tecnología con ese nombre }
 */
router.post('/', requireAdmin, validarTecnologia, ctrl.crear);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   put:
 *     summary: Actualizar una tecnología
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CrearTecnologia' }
 *     responses:
 *       200: { description: Tecnología actualizada }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Tecnología no encontrada }
 *       409: { description: Nombre repetido }
 */
router.put('/:id', requireAdmin, validarId, validarTecnologia, ctrl.actualizar);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   delete:
 *     summary: Eliminar una tecnología (los proyectos no se borran)
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204: { description: Tecnología eliminada }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Tecnología no encontrada }
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

module.exports = router;
