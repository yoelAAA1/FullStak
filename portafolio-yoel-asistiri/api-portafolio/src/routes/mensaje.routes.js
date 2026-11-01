// src/routes/mensaje.routes.js — rutas de /api/mensajes

const router = require('express').Router();
const ctrl = require('../controllers/mensaje.controller');
const requireAdmin = require('../middlewares/auth');
const { validarId, validarMensaje } = require('../middlewares/validar');

/**
 * @swagger
 * /api/mensajes:
 *   post:
 *     summary: Enviar el formulario de contacto (público)
 *     tags: [Mensajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CrearMensaje' }
 *     responses:
 *       201: { description: Mensaje recibido }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// POST es PÚBLICO (sin requireAdmin): cualquier visitante puede escribirte
router.post('/', validarMensaje, ctrl.crear);

/**
 * @swagger
 * /api/mensajes:
 *   get:
 *     summary: Bandeja de entrada (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: leido
 *         schema: { type: boolean }
 *         description: false = solo los no leídos
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Mensaje' }
 *       401: { description: Falta la API key o es incorrecta }
 */
// GET es PRIVADO: solo el administrador ve los mensajes
router.get('/', requireAdmin, ctrl.obtenerTodos);

/**
 * @swagger
 * /api/mensajes/{id}:
 *   patch:
 *     summary: Marcar un mensaje como leído o no leído (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leido: { type: boolean, example: true }
 *     responses:
 *       200: { description: Mensaje actualizado }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Mensaje no encontrado }
 */
router.patch('/:id', requireAdmin, validarId, ctrl.marcarLeido);

/**
 * @swagger
 * /api/mensajes/{id}:
 *   delete:
 *     summary: Eliminar un mensaje (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204: { description: Mensaje eliminado }
 *       401: { description: Falta la API key o es incorrecta }
 *       404: { description: Mensaje no encontrado }
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

module.exports = router;
