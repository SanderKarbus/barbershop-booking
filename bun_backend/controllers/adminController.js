// Bun admin controller (failipõhine)

import { getAll, find, findAll, remove } from '../models/jsondb.js';
import { hashPassword, verifyPassword, signJwt, verifyJwt } from '../models/auth.js';
import fs from 'fs';


const JWT_SECRET = Bun.env.JWT_SECRET || 'supersecret';
const ADMINS = 'bun_backend/admins.json';
const BOOKINGS = 'bun_backend/bookings.json';
const HAIRDRESSERS = 'bun_backend/hairdressers.json';

export async function adminController(req, url) {
  // POST /api/admin/login
  if (url.pathname === '/api/admin/login' && req.method === 'POST') {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) return Response.json({ error: 'Missing credentials' }, { status: 400 });
    const admin = find(ADMINS, a => a.username === username);
    if (!admin) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    if (!(await verifyPassword(password, admin.password_hash))) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = signJwt({ id: admin.id, username: admin.username }, JWT_SECRET);
    return Response.json({ token });
  }
  // Auth middleware
  function getAdminFromAuth(req) {
    const auth = req.headers.get('authorization');
    if (!auth) return null;
    const token = auth.split(' ')[1];
    try {
      return verifyJwt(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
  // GET /api/admin/bookings
  if (url.pathname === '/api/admin/bookings' && req.method === 'GET') {
    const admin = getAdminFromAuth(req);
    if (!admin) return Response.json({ error: 'No or invalid token' }, { status: 401 });
    const date = url.searchParams.get('date');
    let bookings = getAll(BOOKINGS);
    console.log('[GET] Algne bookings failist:', bookings.map(b => ({ id: b.id, date: b.date, time: b.time })));
    if (date) bookings = bookings.filter(b => b.date === date);
    // Lisa juuksuri nimi
    const hairdressers = getAll(HAIRDRESSERS);
    bookings = bookings.map(b => ({ ...b, hairdresser_name: (hairdressers.find(h => h.id === b.hairdresser_id || h === b.hairdresser_id) || {}).name || h || '' }));
    console.log('[GET] Pärast hairdresser mapi:', bookings.map(b => ({ id: b.id, date: b.date, time: b.time })));
    bookings.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    console.log('[GET] Lõplik response:', JSON.stringify(bookings.slice(0, 1)));
    return Response.json(bookings);
  }
  // DELETE /api/admin/booking (täpse broneeringu kustutamine POST body põhjal)
  if (url.pathname === '/api/admin/booking' && (req.method === 'DELETE' || req.method === 'POST')) {
    const admin = getAdminFromAuth(req);
    if (!admin) return Response.json({ error: 'No or invalid token' }, { status: 401 });
    const body = await req.json();
    const { id } = body;
    console.log('[DELETE] Saadud id:', id, 'Tüüp:', typeof id);
    let arr = getAll(BOOKINGS);
    console.log('[DELETE] Broneeringud enne:', JSON.stringify(arr.map(b => ({ id: b.id, type: typeof b.id, date: b.date, time: b.time }))));
    const idx = arr.findIndex((b, i) => {
      const match = String(b.id) === String(id);
      console.log('[DELETE] Rida', i, '- b.id:', b.id, '(type:', typeof b.id, '), match:', match);
      return match;
    });
    console.log('[DELETE] Leitud indeks:', idx);
    if (idx !== -1) {
      const removedBooking = arr[idx];
      arr.splice(idx, 1);
      fs.writeFileSync(BOOKINGS, JSON.stringify(arr, null, 2), 'utf8');
      console.log('[DELETE] Kustutatud broneering:', removedBooking.id);
      console.log('[DELETE] Broneeringud pärast:', JSON.stringify(arr.map(b => ({ id: b.id, date: b.date, time: b.time }))));
      return Response.json({ success: true });
    }
    console.log('[DELETE] EBAÕNNESTUS - id ei leitud');
    return Response.json({ error: 'Booking not found' }, { status: 404 });
  }
  // POST /api/admin/delete-booking (alternatiivne delete endpoint)
  if (url.pathname === '/api/admin/delete-booking' && req.method === 'POST') {
    const admin = getAdminFromAuth(req);
    if (!admin) return Response.json({ error: 'No or invalid token' }, { status: 401 });
    const body = await req.json();
    const { id } = body;
    console.log('[DELETE-2] Saadud id:', id, 'Tüüp:', typeof id);
    let arr = getAll(BOOKINGS);
    const idx = arr.findIndex((b) => String(b.id) === String(id));
    console.log('[DELETE-2] Leitud indeks:', idx);
    if (idx !== -1) {
      const removedBooking = arr[idx];
      arr.splice(idx, 1);
      fs.writeFileSync(BOOKINGS, JSON.stringify(arr, null, 2), 'utf8');
      console.log('[DELETE-2] Kustutatud:', removedBooking.id);
      return Response.json({ success: true });
    }
    console.log('[DELETE-2] EBAÕNNESTUS - id ei leitud');
    return Response.json({ error: 'Booking not found' }, { status: 404 });
  }
  return Response.json({ error: 'Not found' }, { status: 404 });
}
