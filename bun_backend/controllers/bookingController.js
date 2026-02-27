// Bun booking controller

import { getAll, insert, findAll, find } from '../models/jsondb.js';
import { randomUUID } from 'crypto';

export async function bookingController(req, url) {
  const HAIRDRESSERS = 'bun_backend/hairdressers.json';
  const BOOKINGS = 'bun_backend/bookings.json';

  // GET /api/bookings/hairdressers
  if (url.pathname === '/api/bookings/hairdressers' && req.method === 'GET') {
    const names = getAll(HAIRDRESSERS);
    const rows = names.map((h, i) => ({ id: h.id || i+1, name: h.name || h }));
    return Response.json(rows);
  }

  // GET /api/bookings/available?hairdresser_id=...&date=...
  if (url.pathname === '/api/bookings/available' && req.method === 'GET') {
    const hairdresser_id = url.searchParams.get('hairdresser_id');
    const date = url.searchParams.get('date');
    if (!hairdresser_id || !date) return Response.json({ error: 'Missing params' }, { status: 400 });
    const allTimes = Array.from({length: 16}, (_, i) => `${9 + Math.floor(i/2)}:${i%2===0?'00':'30'}`);
    const hairdresser_id_num = Number(hairdresser_id);
    const booked = findAll(BOOKINGS, b => b.hairdresser_id == hairdresser_id_num && b.date === date).map(b => b.time);
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
    return Response.json(available);
  }

  // POST /api/bookings
  if (url.pathname === '/api/bookings' && req.method === 'POST') {
    const body = await req.json();
    const { hairdresser_id, client_name, client_phone, client_email, extra_info, date, time } = body;
    if (!hairdresser_id || !client_name || !client_phone || !client_email || !date || !time) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(client_email)) {
      return Response.json({ error: 'Vigane e-mail' }, { status: 400 });
    }
    if (!/^\+?\d{7,15}$/.test(client_phone.replace(/\s/g, ''))) {
      return Response.json({ error: 'Vigane telefoninumber' }, { status: 400 });
    }
    // Topeltbroneeringu kontroll
    const exists = find(BOOKINGS, b => b.hairdresser_id == hairdresser_id && b.date === date && b.time === time);
    if (exists) return Response.json({ error: 'Time slot already booked' }, { status: 409 });
    // Loo unikaalne id (UUID)
    const uuid = randomUUID();
    const booking = { id: uuid, hairdresser_id, client_name, client_phone, client_email, extra_info, date, time, created_at: new Date().toISOString() };
    console.log('UUSI BRONEERINGU LOOMISE ID:', uuid);
    insert(BOOKINGS, booking);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
