// src/controllers/proyecto.controller.js — lógica de cada endpoint de /api/proyectos
// Un controlador recibe la petición (req), habla con la base de datos (prisma) y responde (res).

// Cliente de Prisma compartido
const prisma = require('../lib/prisma');

// Lista de categorías válidas para revisar el filtro ?categoria=
const { CATEGORIAS } = require('../middlewares/validar');

// Fragmento reutilizable: "incluye las tecnologías de cada proyecto, solo con id, nombre y area"
const conTecnologias = { tecnologias: { select: { id: true, nombre: true, area: true } } };

// Arma el objeto que se guarda en la tabla a partir del body (limpia espacios y pone valores por defecto)
const datosProyecto = ({ titulo, descripcion, emoji, categoria, urlDemo, urlRepo, destacado }) => ({
  titulo: titulo.trim(),              // quita espacios al inicio y al final
  descripcion: descripcion.trim(),
  emoji: emoji || '💻',               // si viene vacío, usa 💻
  categoria,                          // ya validada por validarProyecto
  urlDemo: urlDemo || null,           // "" se guarda como NULL
  urlRepo: urlRepo || null,
  destacado: destacado ?? false,      // ?? usa false solo si es undefined o null
});

// ---------------------------------------------------------------
// GET /api/proyectos?categoria=&tecnologia=&destacado=
// ---------------------------------------------------------------
const obtenerTodos = async (req, res) => {
  // req.query = los parámetros después del "?" en la URL. "?." evita error si no vino
  const categoria = req.query.categoria?.toUpperCase();   // acepta "frontend" o "FRONTEND"
  const { tecnologia, destacado } = req.query;            // destructuring del objeto query

  // Si mandaron una categoría que no existe → 400
  if (categoria && !CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: `categoria debe ser: ${CATEGORIAS.join(', ')}` });
  }

  // findMany = SELECT ... FROM proyectos WHERE ...
  const proyectos = await prisma.proyecto.findMany({
    where: {
      // Spread condicional: si categoria existe agrega { categoria }, si no, no agrega nada
      ...(categoria && { categoria }),
      // destacado llega como texto "true"/"false": lo convertimos a booleano
      ...(destacado !== undefined && { destacado: destacado === 'true' }),
      // "some": proyectos que tengan AL MENOS una tecnología con ese nombre (sin importar mayúsculas)
      ...(tecnologia && {
        tecnologias: { some: { nombre: { equals: tecnologia, mode: 'insensitive' } } },
      }),
    },
    include: conTecnologias,                                // trae también sus tecnologías (JOIN)
    orderBy: [{ destacado: 'desc' }, { creadoEn: 'desc' }], // primero destacados, luego los más nuevos
  });

  res.json(proyectos); // 200 OK con el array en JSON
};

// ---------------------------------------------------------------
// GET /api/proyectos/:id
// ---------------------------------------------------------------
const obtenerPorId = async (req, res) => {
  // findUnique = buscar por clave primaria. req.params.id ya es número (validarId lo convirtió)
  const proyecto = await prisma.proyecto.findUnique({
    where: { id: req.params.id },
    include: conTecnologias,
  });
  // Si no existe → 404
  if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json(proyecto);
};

// ---------------------------------------------------------------
// POST /api/proyectos   (requiere x-api-key)
// ---------------------------------------------------------------
const crear = async (req, res) => {
  const { tecnologiaIds = [] } = req.body;   // si no vienen tecnologías, usamos []
  const proyecto = await prisma.proyecto.create({
    data: {
      ...datosProyecto(req.body),
      // connect: enlaza tecnologías YA existentes por id (llena la tabla intermedia)
      tecnologias: { connect: tecnologiaIds.map((id) => ({ id })) },
    },
    include: conTecnologias,
  });
  res.status(201).json(proyecto); // 201 = Created
};

// ---------------------------------------------------------------
// PUT /api/proyectos/:id   (requiere x-api-key)
// ---------------------------------------------------------------
const actualizar = async (req, res) => {
  const { tecnologiaIds = [] } = req.body;
  // update lanza el error P2025 si el id no existe → errorHandler responde 404
  const proyecto = await prisma.proyecto.update({
    where: { id: req.params.id },
    data: {
      ...datosProyecto(req.body),
      // set: REEMPLAZA la lista completa de tecnologías por la nueva
      tecnologias: { set: tecnologiaIds.map((id) => ({ id })) },
    },
    include: conTecnologias,
  });
  res.json(proyecto);
};

// ---------------------------------------------------------------
// DELETE /api/proyectos/:id   (requiere x-api-key)
// ---------------------------------------------------------------
const eliminar = async (req, res) => {
  await prisma.proyecto.delete({ where: { id: req.params.id } });
  res.status(204).send(); // 204 = No Content (borrado, sin cuerpo de respuesta)
};

// Exportamos todas las funciones para conectarlas con las rutas
module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
