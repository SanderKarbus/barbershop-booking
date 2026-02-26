// Admin user creation script for BookBarber
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./backend/bookbarber.db');

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('Kasuta: node backend/create-admin.js <kasutajanimi> <parool>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  db.run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hash], function(err) {
    if (err) {
      console.error('Viga:', err.message);
    } else {
      console.log('Admin kasutaja loodud:', username);
    }
    db.close();
  });
});
