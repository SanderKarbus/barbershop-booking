// Bun-native auth utilid (bcrypt, JWT)
import { createHash } from 'crypto';

// Lihtne parooli räsi (Bunil pole veel bcrypti, kasuta vajadusel argon2 vms)
export async function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(password, hash) {
  return (await hashPassword(password)) === hash;
}

// JWT (lihtne, ilma aegumiseta)
export function signJwt(payload, secret) {
  return Buffer.from(JSON.stringify(payload) + '.' + secret).toString('base64');
}
export function verifyJwt(token, secret) {
  const [payload, sig] = Buffer.from(token, 'base64').toString('utf8').split('.');
  if (sig !== secret) throw new Error('Invalid token');
  return JSON.parse(payload);
}
