// Bun-native failipõhine "andmebaas" Windowsi jaoks

import fs from 'fs';
import path from 'path';


const DATA_DIR = path.join(import.meta.dir, '../../data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const HAIRDRESSERS_FILE = path.join(DATA_DIR, 'hairdressers.json');

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, '[]');
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[{"username":"admin","password_hash":"21232f297a57a5a743894a0e4a801fc3"}]'); // admin:admin
  if (!fs.existsSync(HAIRDRESSERS_FILE)) fs.writeFileSync(HAIRDRESSERS_FILE, '["Anna Kask","Marek Saar","Liis Tamm","Kristjan Põld"]');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function getBookings() {
  ensureFiles();
  return readJson(BOOKINGS_FILE);
}
export function saveBookings(bookings) {
  writeJson(BOOKINGS_FILE, bookings);
}
export function getUsers() {
  ensureFiles();
  return readJson(USERS_FILE);
}
export function saveUsers(users) {
  writeJson(USERS_FILE, users);
}
export function getHairdressers() {
  ensureFiles();
  return readJson(HAIRDRESSERS_FILE);
}
