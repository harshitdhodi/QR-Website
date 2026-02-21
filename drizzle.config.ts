import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv";

dotenv.config();
export default defineConfig({
  dialect: 'mysql',
  mode: 'default', // Add this line
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT),
  },
  verbose: true,
  strict: true,
}) satisfies Config;