import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

const globalForDb = global as unknown as { conn: mysql.Pool };

const poolConnection = globalForDb.conn || mysql.createPool({
  uri: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = poolConnection;

export const db = drizzle(poolConnection, { schema, mode: "default" });