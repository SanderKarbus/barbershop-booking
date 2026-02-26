// SQLite DB init for BookBarber
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/bookbarber.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS hairdressers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
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

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  )`);

  // Insert sample hairdressers if not exists
  db.all('SELECT COUNT(*) as count FROM hairdressers', (err, rows) => {
    if (rows[0].count === 0) {
      const stmt = db.prepare('INSERT INTO hairdressers (name) VALUES (?)');
      ['Anna Kask', 'Marek Saar', 'Liis Tamm', 'Kristjan Põld'].forEach(name => stmt.run(name));
      stmt.finalize();
    }
  });
});

module.exports = db;
