import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const API = 'http://localhost:3001/api';

export default function AdminBookings({ token, onLogout }) {
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  const fetchBookings = () => {
    setError(null);
    axios.get(`${API}/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
      params: date ? { date } : {}
    })
      .then(r => setBookings(r.data))
      .catch(e => setError(e.response?.data?.error || 'Viga'));
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [date]);

  const handleDelete = async (id) => {
    if (!window.confirm('Kas oled kindel, et soovid selle broneeringu kustutada?')) return;
    try {
      await axios.delete(`${API}/admin/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (e) {
      setError(e.response?.data?.error || 'Kustutamine ebaõnnestus');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Broneeringute nimekiri</Typography>
        <Button onClick={onLogout} color="secondary" variant="outlined">Logi välja</Button>
      </Box>
      <TextField
        type="date"
        label="Kuupäev"
        value={date}
        onChange={e => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <Button onClick={fetchBookings} variant="contained" sx={{ ml: 2 }}>Värskenda</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kuupäev</TableCell>
              <TableCell>Aeg</TableCell>
              <TableCell>Juuksur</TableCell>
              <TableCell>Kliendi nimi</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Lisainfo</TableCell>
              <TableCell>Kustuta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.date}</TableCell>
                <TableCell>{b.time}</TableCell>
                <TableCell>{b.hairdresser_name}</TableCell>
                <TableCell>{b.client_name}</TableCell>
                <TableCell>{b.client_phone}</TableCell>
                <TableCell>{b.client_email}</TableCell>
                <TableCell>{b.extra_info}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(b.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">Broneeringuid ei leitud</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
