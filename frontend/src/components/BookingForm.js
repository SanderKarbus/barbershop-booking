import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, MenuItem, TextField, Typography, Alert, CircularProgress, ToggleButton, ToggleButtonGroup, Paper
} from '@mui/material';

const API = 'http://localhost:3001/api';

export default function BookingForm({ darkMode }) {
  const [hairdressers, setHairdressers] = useState([]);
  const [hairdresser, setHairdresser] = useState('');
  const [date, setDate] = useState('');
  const [times, setTimes] = useState([]);
  const [time, setTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', extra: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`${API}/bookings/hairdressers`).then(r => setHairdressers(r.data));
  }, []);

  useEffect(() => {
    if (hairdresser && date) {
      setLoading(true);
      axios.get(`${API}/bookings/available`, { params: { hairdresser_id: hairdresser, date } })
        .then(r => setTimes(r.data)).finally(() => setLoading(false));
    } else {
      setTimes([]);
      setTime('');
    }
  }, [hairdresser, date]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !hairdresser || !date || !time) return 'Kõik väljad on kohustuslikud';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Vigane e-mail';
    if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) return 'Vigane telefoninumber';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setResult(null);
    const errMsg = validate();
    if (errMsg) {
      setResult({ success: false, error: errMsg });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/bookings`, {
        hairdresser_id: hairdresser,
        client_name: form.name,
        client_phone: form.phone,
        client_email: form.email,
        extra_info: form.extra,
        date,
        time
      });
      setResult({ success: true, booking_id: res.data.booking_id });
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || 'Viga' });
    }
    setLoading(false);
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, bgcolor: darkMode ? '#23272f' : '#f8fbff', borderRadius: 3, mt: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }} align="center">
          Vali juuksur
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={hairdresser}
          exclusive
          onChange={(_, v) => setHairdresser(v)}
          fullWidth
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}
        >
          {hairdressers.map(h => {
            const firstName = h.name.split(' ')[0];
            return (
              <ToggleButton
                key={h.id}
                value={h.id}
                sx={{
                  flex: '1 1 45%',
                  minWidth: 160,
                  maxWidth: 180,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 3,
                  border: hairdresser === h.id ? '2px solid transparent' : '2px solid',
                  borderColor: hairdresser === h.id ? (darkMode ? '#90caf9' : 'primary.main') : (darkMode ? '#90caf9' : 'primary.main'),
                  bgcolor: hairdresser === h.id ? (darkMode ? '#1976d2' : 'primary.main') : (darkMode ? '#23272f' : 'white'),
                  color: hairdresser === h.id ? 'white' : (darkMode ? '#90caf9' : 'primary.main'),
                  transition: 'all 0.2s',
                  m: 0.5,
                  boxShadow: hairdresser === h.id ? 4 : 1,
                  zIndex: hairdresser === h.id ? 1 : 0,
                  '&.MuiToggleButton-root': {
                    borderRadius: 3
                  },
                  '&:not(:first-of-type)': {
                    borderLeft: '2px solid',
                    borderLeftColor: darkMode ? '#90caf9' : 'primary.main'
                  }
                }}
              >
                {firstName}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <TextField
          type="date"
          label="Kuupäev"
          value={date}
          onChange={e => setDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
        />
        <TextField
          select
          label="Aeg"
          value={time}
          onChange={e => setTime(e.target.value)}
          fullWidth
          required
          margin="normal"
          disabled={!times.length}
          sx={{ mb: 2 }}
        >
          {times.map(t => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Nimi"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Telefon"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="E-mail"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          type="email"
        />
        <TextField
          label="Lisainfo (soovi korral)"
          name="extra"
          value={form.extra}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
        <Box sx={{ mt: 3, mb: 1 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, fontSize: 18, py: 1.5 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Broneeri aeg'}
          </Button>
        </Box>
        {result && (
          result.success ? (
            <Alert severity="success">
              Teie broneering õnnestus!<br />
              Broneeringu kinnituse ja detailid leiate sisestatud emaililt. Kohtumiseni!
            </Alert>
          ) : (
            <Alert severity="error">{result.error}</Alert>
          )
        )}
      </Box>
    </Paper>
  );
}
