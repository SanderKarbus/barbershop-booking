import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Alert, CircularProgress
} from '@mui/material';

const API = 'http://localhost:3001/api';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Viga');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 350, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>Admini sisselogimine</Typography>
      <TextField
        label="Kasutajanimi"
        name="username"
        value={form.username}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Parool"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <Box sx={{ mt: 2, mb: 1 }}>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Logi sisse'}
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
