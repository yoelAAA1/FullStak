// src/middlewares/errorHandler.js — atrapa TODOS los errores y responde un JSON entendible
// Express 5 envía aquí automáticamente cualquier error de un controlador async (sin try/catch).
// Express sabe que es "de errores" porque recibe 4 parámetros: (err, req, res, next).

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Mostramos el error completo en la terminal del servidor (para depurar)
  console.error(err);

  // El body no era un JSON válido (por ejemplo, falta una comilla)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido' });
  }

  // Código de Prisma P2025: se intentó actualizar/borrar un registro que no existe
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  // Código de Prisma P2002: se violó un @unique (ej. crear "React" cuando ya existe)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' }); // 409 = Conflict
  }

  // Código de Prisma P2003: se referenció un id que no existe (clave foránea)
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Referencia a registro inexistente' });
  }

  // Cualquier otro error: 500. En producción no mostramos el detalle interno
  const mensaje = process.env.NODE_ENV === 'production' ? undefined : err.message;
  res.status(500).json({ error: 'Error interno del servidor', mensaje });
};

module.exports = errorHandler;
