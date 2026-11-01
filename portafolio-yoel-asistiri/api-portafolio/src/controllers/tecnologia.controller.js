// src/controllers/tecnologia.controller.js — lógica de /api/tecnologias

const prisma = require('../lib/prisma');            // cliente de la base de datos
const { AREAS } = require('../middlewares/validar'); // áreas válidas para el filtro ?area=

// ---------------------------------------------------------------
// GET /api/tecnologias?area=
// ---------------------------------------------------------------
const obtenerTodas = async (req, res) => {
  const area = req.query.area?.toUpperCase();       // "base_datos" → "BASE_DATOS"

  // Área inexistente → 400
  if (area && !AREAS.includes(area)) {
    return res.status(400).json({ error: `area debe ser: ${AREAS.join(', ')}` });
  }

  const tecnologias = await prisma.tecnologia.findMany({
    where: area ? { area } : {},                              // filtra solo si mandaron área
    include: { _count: { select: { proyectos: true } } },     // agrega "_count": { "proyectos": 2 }
    orderBy: { nombre: 'asc' },                               // orden alfabético
  });
  res.json(tecnologias);
};

// ---------------------------------------------------------------
// GET /api/tecnologias/:id  → la tecnología y los proyectos que la usan
// ---------------------------------------------------------------
const obtenerPorId = async (req, res) => {
  const tecnologia = await prisma.tecnologia.findUnique({
    where: { id: req.params.id },
    include: { proyectos: { select: { id: true, titulo: true } } },
  });
  if (!tecnologia) return res.status(404).json({ error: 'Tecnología no encontrada' });
  res.json(tecnologia);
};

// ---------------------------------------------------------------
// POST /api/tecnologias   (requiere x-api-key)
// ---------------------------------------------------------------
const crear = async (req, res) => {
  const { nombre, area } = req.body;
  // Si el nombre ya existe, Prisma lanza P2002 → errorHandler responde 409
  const tecnologia = await prisma.tecnologia.create({ data: { nombre: nombre.trim(), area } });
  res.status(201).json(tecnologia);
};

// ---------------------------------------------------------------
// PUT /api/tecnologias/:id   (requiere x-api-key)
// ---------------------------------------------------------------
const actualizar = async (req, res) => {
  const { nombre, area } = req.body;
  const tecnologia = await prisma.tecnologia.update({
    where: { id: req.params.id },
    data: { nombre: nombre.trim(), area },
  });
  res.json(tecnologia);
};

// ---------------------------------------------------------------
// DELETE /api/tecnologias/:id   (requiere x-api-key)
// Los proyectos NO se borran: solo pierden esa etiqueta (ON DELETE CASCADE en la tabla intermedia)
// ---------------------------------------------------------------
const eliminar = async (req, res) => {
  await prisma.tecnologia.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar };
