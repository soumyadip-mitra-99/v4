import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "./env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql);
