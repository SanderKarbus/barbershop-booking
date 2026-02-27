// Bun-native SQLite mudel
import sqlite from 'sqlite';
const db = new sqlite.Database('bun_backend/bookbarber.db');
db.exec(`CREATE TABLE IF NOT EXISTS hairdressers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);
db.exec(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hairdresser_id INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  extra_info TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hairdresser_id) REFERENCES hairdressers(id)
)`);
db.exec(`CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
)`);
// Lisa vaikimisi juuksurid kui puuduvad
const count = db.prepare('SELECT COUNT(*) as count FROM hairdressers').get().count;
if (count === 0) {
  const stmt = db.prepare('INSERT INTO hairdressers (name) VALUES (?)');
  ['Anna Kask', 'Marek Saar', 'Liis Tamm', 'Kristjan Põld'].forEach(name => stmt.run(name));
}
export { db };
