const express = require('express');
const db = require('../backend/init-db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  if (typeof username !== 'string' || typeof password !== 'string' || username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'Vigased andmed' });
  }
  db.get('SELECT * FROM admins WHERE username=?', [username], (err, admin) => {
    if (err || !admin) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, admin.password_hash, (err, result) => {
      if (!result) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    });
  });
});

// Middleware for admin auth
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.admin = decoded;
    next();
  });
}

// List bookings by date (protected)
router.get('/bookings', requireAuth, (req, res) => {
  const { date } = req.query;
  let sql = `SELECT b.*, h.name as hairdresser_name FROM bookings b JOIN hairdressers h ON b.hairdresser_id = h.id`;
  let params = [];
  if (date) {
    sql += ' WHERE b.date=?';
    params.push(date);
  }
  sql += ' ORDER BY b.date DESC, b.time ASC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Delete booking by id (protected)
router.delete('/booking/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM bookings WHERE id=?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true });
  });
});

module.exports = router;
