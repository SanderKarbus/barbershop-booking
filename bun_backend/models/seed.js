// Initsialiseeri failipõhine "andmebaas" kui vaja
import fs from 'fs';
const hairFile = 'bun_backend/hairdressers.json';
if (!fs.existsSync(hairFile)) {
  fs.writeFileSync(hairFile, JSON.stringify([
    {id: 1, name: 'Anna Kask'},
    {id: 2, name: 'Marek Saar'},
    {id: 3, name: 'Liis Tamm'},
    {id: 4, name: 'Kristjan Põld'}
  ], null, 2));
}
const adminFile = 'bun_backend/admins.json';
if (!fs.existsSync(adminFile)) {
  fs.writeFileSync(adminFile, JSON.stringify([
    {id: 1, username: 'admin', password_hash: 'admin123'} // NB! Parool räsi tee hiljem
  ], null, 2));
}
const bookingsFile = 'bun_backend/bookings.json';
if (!fs.existsSync(bookingsFile)) {
  fs.writeFileSync(bookingsFile, '[]');
}
