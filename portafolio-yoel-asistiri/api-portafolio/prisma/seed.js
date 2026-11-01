// prisma/seed.js — carga los datos iniciales del portafolio de Yoel
// Se ejecuta con:  npm run db:seed   (o  npx prisma db seed)
// ⚠️ BORRA todo antes de insertar: no lo uses en una base con datos reales.

// Cargamos el .env para que exista DATABASE_URL
require('dotenv').config({ quiet: true });

// Reutilizamos el mismo cliente de Prisma de la API
const prisma = require('../src/lib/prisma');

// 14 tecnologías: { nombre, area }
const tecnologias = [
  { nombre: 'HTML5', area: 'FRONTEND' },
  { nombre: 'CSS Grid', area: 'FRONTEND' },
  { nombre: 'Flexbox', area: 'FRONTEND' },
  { nombre: 'CSS Modules', area: 'FRONTEND' },
  { nombre: 'JavaScript', area: 'FRONTEND' },
  { nombre: 'React', area: 'FRONTEND' },
  { nombre: 'Chart.js', area: 'FRONTEND' },
  { nombre: 'Fetch API', area: 'FRONTEND' },
  { nombre: 'Node.js', area: 'BACKEND' },
  { nombre: 'Express', area: 'BACKEND' },
  { nombre: 'JWT', area: 'BACKEND' },
  { nombre: 'OpenWeather', area: 'HERRAMIENTA' },
  { nombre: 'PostgreSQL', area: 'BASE_DATOS' },
  { nombre: 'MySQL', area: 'BASE_DATOS' },
];

// 5 proyectos (los mismos de localProjects de la sesión 3). "tecnologias" son NOMBRES, no ids
const proyectos = [
  {
    titulo: 'App de Tareas', emoji: '📱', categoria: 'FRONTEND', destacado: true,
    descripcion: 'Aplicación web con drag & drop, almacenamiento local y modo oscuro.',
    tecnologias: ['React', 'CSS Modules', 'Flexbox'],
  },
  {
    titulo: 'EcoShop', emoji: '🌿', categoria: 'FRONTEND',
    descripcion: 'E-commerce sostenible con sistema de filtros y carrito de compras.',
    tecnologias: ['HTML5', 'CSS Grid', 'JavaScript'],
  },
  {
    titulo: 'Dashboard Analytics', emoji: '📊', categoria: 'FULLSTACK', destacado: true,
    descripcion: 'Panel con gráficas en tiempo real, filtros dinámicos y exportación.',
    tecnologias: ['Node.js', 'PostgreSQL', 'Chart.js'],
  },
  {
    titulo: 'REST API – Inventario', emoji: '🔧', categoria: 'BACKEND',
    descripcion: 'API REST completa con autenticación JWT y documentación Swagger.',
    tecnologias: ['Express', 'MySQL', 'JWT'],
  },
  {
    titulo: 'GeoWeather App', emoji: '🌍', categoria: 'FULLSTACK',
    descripcion: 'Consulta clima en tiempo real usando la API de OpenWeather y países.',
    tecnologias: ['React', 'Fetch API', 'OpenWeather'],
  },
];

// Función principal (async para poder usar await)
async function main() {
  // 1) Borrar en orden, así el seed se puede ejecutar varias veces
  await prisma.mensaje.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.tecnologia.deleteMany();

  // 2) Insertar las 14 tecnologías en UNA sola consulta
  await prisma.tecnologia.createMany({ data: tecnologias });

  // 3) Insertar cada proyecto. Destructuring con renombre + rest:
  //    "tecnologias" pasa a llamarse "nombres" y el resto de campos queda en "datos"
  for (const { tecnologias: nombres, ...datos } of proyectos) {
    await prisma.proyecto.create({
      data: {
        ...datos,
        // connect por "nombre" (es @unique), así no necesitamos conocer los ids
        tecnologias: { connect: nombres.map((nombre) => ({ nombre })) },
      },
    });
  }

  console.log(`Seed listo: ${tecnologias.length} tecnologías y ${proyectos.length} proyectos`);
}

// Ejecutamos main; si falla mostramos el error y salimos con código 1; al final cerramos la conexión
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
