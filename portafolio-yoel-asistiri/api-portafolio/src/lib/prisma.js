// src/lib/prisma.js — una sola conexión a la base de datos para toda la API

// PrismaClient: la clase generada por "npx prisma generate" con métodos como prisma.proyecto.findMany()
const { PrismaClient } = require('@prisma/client');

// PrismaPg: el "driver adapter" que conecta Prisma 7 con PostgreSQL (en Prisma 7 es obligatorio)
const { PrismaPg } = require('@prisma/adapter-pg');

// Creamos el adaptador con la URL del .env (dotenv ya la cargó en app.js o seed.js)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Creamos UNA instancia del cliente usando ese adaptador
const prisma = new PrismaClient({ adapter });

// La exportamos: todos los controladores hacen require('../lib/prisma') y reciben ESTA MISMA instancia
// (Node guarda los módulos en caché, así no se abren muchas conexiones)
module.exports = prisma;
