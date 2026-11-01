// src/middlewares/validar.js — revisa que los datos que llegan sean correctos ANTES de tocar la base de datos

// Valores permitidos (los mismos que los enums de schema.prisma)
const CATEGORIAS = ['FRONTEND', 'BACKEND', 'FULLSTACK'];
const AREAS = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'];

// Expresión regular simple para un correo: algo@algo.algo (sin espacios)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve true si "valor" es texto y, sin espacios al inicio/fin, tiene al menos "min" caracteres
const esTextoValido = (valor, min = 1) => typeof valor === 'string' && valor.trim().length >= min;

// Si hay errores responde 400 con la lista; si no hay, deja pasar con next()
const responder = (errores, res, next) =>
  errores.length
    ? res.status(400).json({ error: 'Datos inválidos', detalles: errores }) // 400 = Bad Request
    : next();

// ---------------------------------------------------------------
// :id de la URL → debe ser un entero positivo (/api/proyectos/3 ✔, /api/proyectos/abc ✘)
// ---------------------------------------------------------------
const validarId = (req, res, next) => {
  const id = Number(req.params.id);                 // los parámetros de la URL siempre llegan como texto
  if (!Number.isInteger(id) || id <= 0) {           // ¿no es entero o es 0/negativo?
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  req.params.id = id;                               // lo guardamos ya convertido a número para el controlador
  next();                                           // seguimos
};

// ---------------------------------------------------------------
// Body de POST/PUT /api/proyectos
// ---------------------------------------------------------------
const validarProyecto = (req, res, next) => {
  // "?? {}" evita un error si el body viene vacío
  const { titulo, descripcion, categoria, tecnologiaIds, destacado } = req.body ?? {};
  const errores = [];                               // aquí juntamos todos los problemas encontrados

  if (!esTextoValido(titulo, 3)) errores.push('titulo es obligatorio (mínimo 3 caracteres)');
  if (!esTextoValido(descripcion, 10)) errores.push('descripcion es obligatoria (mínimo 10 caracteres)');
  if (!CATEGORIAS.includes(categoria)) errores.push(`categoria debe ser: ${CATEGORIAS.join(', ')}`);

  // tecnologiaIds es opcional, pero si viene debe ser un array de enteros: [1, 2, 5]
  if (tecnologiaIds !== undefined) {
    if (!Array.isArray(tecnologiaIds) || !tecnologiaIds.every(Number.isInteger)) {
      errores.push('tecnologiaIds debe ser un array de números enteros');
    }
  }
  // destacado es opcional, pero si viene debe ser booleano
  if (destacado !== undefined && typeof destacado !== 'boolean') {
    errores.push('destacado debe ser true o false');
  }

  responder(errores, res, next);
};

// ---------------------------------------------------------------
// Body de POST/PUT /api/tecnologias
// ---------------------------------------------------------------
const validarTecnologia = (req, res, next) => {
  const { nombre, area } = req.body ?? {};
  const errores = [];

  if (!esTextoValido(nombre)) errores.push('nombre es obligatorio');
  if (!AREAS.includes(area)) errores.push(`area debe ser: ${AREAS.join(', ')}`);

  responder(errores, res, next);
};

// ---------------------------------------------------------------
// Body de POST /api/mensajes (formulario de contacto, público)
// ---------------------------------------------------------------
const validarMensaje = (req, res, next) => {
  const { nombre, email, mensaje, presupuesto, fecha } = req.body ?? {};
  const errores = [];

  if (!esTextoValido(nombre, 3)) errores.push('nombre es obligatorio (mínimo 3 caracteres)');
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) errores.push('email no es válido');
  if (!esTextoValido(mensaje, 20)) errores.push('mensaje es obligatorio (mínimo 20 caracteres)');

  // presupuesto opcional: si viene con algo, tiene que poder convertirse a número
  if (presupuesto !== undefined && presupuesto !== '' && Number.isNaN(Number(presupuesto))) {
    errores.push('presupuesto debe ser un número');
  }
  // fecha opcional: si viene, Date.parse debe entenderla (formato AAAA-MM-DD)
  if (fecha && Number.isNaN(Date.parse(fecha))) errores.push('fecha no es válida (formato AAAA-MM-DD)');

  responder(errores, res, next);
};

// Exportamos las constantes (las usan los controladores) y los middlewares (los usan las rutas)
module.exports = { CATEGORIAS, AREAS, validarId, validarProyecto, validarTecnologia, validarMensaje };
