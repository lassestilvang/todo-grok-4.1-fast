import { schema } from "../schema";

let cachedDb: any = null;

export async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const { default: Database } = await import("better-sqlite3");

  const sqlite = new Database("./db.sqlite");

  cachedDb = drizzle(sqlite, { schema });

  return cachedDb;
}
