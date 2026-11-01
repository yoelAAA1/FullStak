// prisma.config.ts — configuración de la CLI de Prisma 7
// La CLI (npx prisma migrate, generate, db seed, studio) lee este archivo al arrancar.

// Carga las variables del archivo .env en process.env (necesitamos DATABASE_URL)
import 'dotenv/config';

// defineConfig: ayuda a escribir la configuración con autocompletado
// env: lee una variable de entorno y avisa si no existe
import { defineConfig, env } from 'prisma/config';

// Exportamos la configuración por defecto
export default defineConfig({
  // Dónde está el archivo con los modelos (tablas)
  schema: 'prisma/schema.prisma',

  migrations: {
    // Carpeta donde se guardan los archivos .sql de cada migración
    path: 'prisma/migrations',
    // Comando que ejecuta "npx prisma db seed" para cargar datos iniciales
    seed: 'node prisma/seed.js',
  },

  datasource: {
    // URL de conexión a PostgreSQL, tomada del .env
    url: env('DATABASE_URL'),
  },
});
