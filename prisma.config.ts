import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_URL (puerto 5432) para schema engine — pgbouncer no soporta prepared statements
    url: env('DIRECT_URL'),
  },
});
