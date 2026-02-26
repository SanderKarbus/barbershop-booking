const express = require('express');
const db = require('../backend/init-db');
const router = express.Router();

// Get all hairdressers
router.get('/hairdressers', (req, res) => {
  db.all('SELECT * FROM hairdressers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get available times for a hairdresser on a date
router.get('/available', (req, res) => {
  const { hairdresser_id, date } = req.query;
  if (!hairdresser_id || !date) return res.status(400).json({ error: 'Missing params' });
  // Example: 9:00-17:00, 30min slots
  const allTimes = Array.from({length: 16}, (_, i) => `${9 + Math.floor(i/2)}:${i%2===0?'00':'30'}`);
  db.all('SELECT time FROM bookings WHERE hairdresser_id=? AND date=?', [hairdresser_id, date], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const booked = rows.map(r => r.time);
    let available = allTimes.filter(t => !booked.includes(t));
    // Filter out past times if date is today
    const today = new Date();
    const reqDate = new Date(date);
    if (
      reqDate.getFullYear() === today.getFullYear() &&
      reqDate.getMonth() === today.getMonth() &&
      reqDate.getDate() === today.getDate()
    ) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      available = available.filter(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m > nowMinutes;
      });
    }
    res.json(available);
  });
});

// Create a booking
router.post('/', (req, res) => {
  const { hairdresser_id, client_name, client_phone, client_email, extra_info, date, time } = req.body;
  // Simple input validation
  if (!hairdresser_id || !client_name || !client_phone || !client_email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^\S+@\S+\.\S+$/.test(client_email)) {
    return res.status(400).json({ error: 'Vigane e-mail' });
  }
  if (!/^\+?\d{7,15}$/.test(client_phone.replace(/\s/g, ''))) {
    return res.status(400).json({ error: 'Vigane telefoninumber' });
  }
  // Prevent double booking
  db.get('SELECT * FROM bookings WHERE hairdresser_id=? AND date=? AND time=?', [hairdresser_id, date, time], (err, row) => {
    if (row) return res.status(409).json({ error: 'Time slot already booked' });
    db.run('INSERT INTO bookings (hairdresser_id, client_name, client_phone, client_email, extra_info, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [hairdresser_id, client_name, client_phone, client_email, extra_info || '', date, time],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, booking_id: this.lastID });
      }
    );
  });
});

module.exports = router;
