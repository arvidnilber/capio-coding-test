import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open the SQLite database
export const openDB = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // Create the users table if it does not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      phone TEXT NOT NULL
    );
  `);

  // Create the tokens table if it does not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      tokenId INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL
    );
  `);

  return db;
};
