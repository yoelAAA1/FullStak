// src/controllers/mensaje.controller.js — lógica de /api/mensajes (formulario de contacto)

const prisma = require('../lib/prisma');

// ---------------------------------------------------------------
// POST /api/mensajes   (PÚBLICO: lo usa el formulario de contacto)
// ---------------------------------------------------------------
const crear = async (req, res) => {
  const { nombre, email, servicio, presupuesto, fecha, mensaje } = req.body;
  const nuevo = await prisma.mensaje.create({
    data: {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),                    // guardamos el correo en minúsculas
      servicio: servicio || null,                           // "" → NULL
      presupuesto: presupuesto ? Number(presupuesto) : null, // "500" → 500
      fecha: fecha ? new Date(fecha) : null,                 // "2026-11-15" → objeto Date
      mensaje: mensaje.trim(),
    },
  });
  // Al visitante solo le devolvemos el id y un texto amable
  res.status(201).json({ id: nuevo.id, mensaje: 'Mensaje recibido. ¡Gracias por escribir!' });
};

// ---------------------------------------------------------------
// GET /api/mensajes?leido=false   (ADMIN: bandeja de entrada)
// ---------------------------------------------------------------
const obtenerTodos = async (req, res) => {
  const { leido } = req.query;
  const mensajes = await prisma.mensaje.findMany({
    // Si mandan ?leido=true o ?leido=false filtramos; si no, traemos todos
    where: leido !== undefined ? { leido: leido === 'true' } : {},
    orderBy: { creadoEn: 'desc' },                          // los más recientes primero
  });
  res.json(mensajes);
};

// ---------------------------------------------------------------
// PATCH /api/mensajes/:id   (ADMIN: cambia SOLO el campo leido)
// PUT reemplaza todo el recurso; PATCH cambia solo algunos campos.
// ---------------------------------------------------------------
const marcarLeido = async (req, res) => {
  const { leido = true } = req.body ?? {};                  // si no mandan nada, lo marcamos como leído
  if (typeof leido !== 'boolean') {
    return res.status(400).json({ error: 'leido debe ser true o false' });
  }
  const mensaje = await prisma.mensaje.update({
    where: { id: req.params.id },
    data: { leido },
  });
  res.json(mensaje);
};

// ---------------------------------------------------------------
// DELETE /api/mensajes/:id   (ADMIN)
// ---------------------------------------------------------------
const eliminar = async (req, res) => {
  await prisma.mensaje.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

module.exports = { crear, obtenerTodos, marcarLeido, eliminar };
