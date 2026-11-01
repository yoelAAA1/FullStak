// src/middlewares/auth.js — protege las rutas de administración (crear, editar, borrar)

// Un middleware es una función (req, res, next) que se ejecuta ANTES del controlador
const requireAdmin = (req, res, next) => {
  // req.get('x-api-key') lee el header "x-api-key" que envía el cliente (React, Swagger, Postman)
  // Lo comparamos con la clave guardada en el .env
  if (req.get('x-api-key') !== process.env.ADMIN_API_KEY) {
    // Si no coincide: 401 (No autorizado) y NO llamamos a next() → el controlador nunca se ejecuta
    return res.status(401).json({ error: 'No autorizado' });
  }
  // Si coincide: next() pasa al siguiente middleware o al controlador
  next();
};

// Exportamos la función para usarla en los archivos de rutas
module.exports = requireAdmin;
