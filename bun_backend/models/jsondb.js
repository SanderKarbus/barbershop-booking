// Bun-native failipõhine "andmebaas" (JSON)
import fs from 'fs';

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function getAll(file) {
  return readJson(file);
}
export function insert(file, obj) {
  const arr = readJson(file);
  arr.push(obj);
  writeJson(file, arr);
}
export function update(file, filter, updater) {
  let arr = readJson(file);
  arr = arr.map(item => filter(item) ? updater(item) : item);
  writeJson(file, arr);
}
export function remove(file, filter) {
  let arr = readJson(file);
  const idx = arr.findIndex(filter);
  if (idx !== -1) {
    arr.splice(idx, 1);
    writeJson(file, arr);
  }
}
export function find(file, filter) {
  return readJson(file).find(filter);
}
export function findAll(file, filter) {
  return readJson(file).filter(filter);
}
