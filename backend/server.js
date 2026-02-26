const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./init-db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Import routes
const bookingRoutes = require('../controllers/bookingController');
const adminRoutes = require('../controllers/adminController');

app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('BookBarber backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
