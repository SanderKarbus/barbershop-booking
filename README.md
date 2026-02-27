# Dream Barber – juuksurisalongi broneerimissüsteem
**Stack:** Bun (backend) · React + MUI (frontend) · SQLite  
**Avalik URL:** https://dreambarbers.onrender.com  
**Admin:** https://dreambarbers.onrender.com/admin (admin / admin123)

---

## 1. Klient–server arhitektuur
Rakendus kasutab selget klient–server mudelit:

- **Frontend (React + MUI)** kuvab kasutajale juuksurite valiku, ajad, broneerimisvormi ja saadab API kaudu päringuid backendile.
- **Backend (Bun runtime)** pakub REST‑API lõpp‑punkte (`/api/...`), valideerib sisendi, kontrollib topeltbroneeringuid ja suhtleb SQLite andmebaasiga.
- **Andmebaas (SQLite)** hoiab juuksureid ja broneeringuid. Kõik vastused tagastatakse JSON vormingus.

**Näide töövoost:**  
kasutaja täidab vormi → frontend teeb POST `/api/bookings` → backend valideerib → salvestab andmebaasi → frontend kuvab kinnituse.

---

## 2. Kasutatud “raamistikulaadne” ülesehitus
Kuigi Bun ei ole klassikaline raamistik, on projekt struktureeritud MVC‑loogika järgi:

- **models/** – andmebaasi päringud ja äriloogika  
- **controllers/** – REST lõpp‑punktide kontrollerid  
- **frontend/** – React vaated (UI)  
- **server.js** – Bun HTTP server + routing  
- **config/** – keskkonnamuutujad (`ADMIN_JWT_SECRET`, `PORT`)

Selline jaotus hoiab koodi loetava, modulaarse ja hooldatavana.

---

## 3. Turvariskid ja rakendatud kaitsemeetmed

### **SQL Injection**
- SQLite päringud kasutavad parametreid.  
- Sisendid valideeritakse serveris.

### **XSS (cross‑site scripting)**
- Backend saadab ainult JSON‑i.  
- Frontend ei süsti kasutaja sisestatud HTML‑i DOM‑i.

### **Autoriseerimine (admin)**
- Admin kasutab JWT tokenit (`ADMIN_JWT_SECRET`).  
- Kaitstud API lõpp‑punktid nõuavad kehtivat Authorization päist.

### **Topeltbroneeringud**
- Server kontrollib enne salvestust, kas aeg on vaba.
- SQLite tasemel on `UNIQUE(hairdresser_id, date, time)` piirang.

---

## 4. Koodistandard ja projektistruktuuri põhimõtted
- Selged kaustad: **controllers**, **models**, **config**, **frontend**  
- Korduvkasutatavad funktsioonid: valideerimine, päringud  
- Ühtne stiil React komponendis (MUI komponendid)  
- Frontend ja backend on rangelt eraldatud ning suhtlevad REST API kaudu  
- Selge build‑protsess: React → build, Bun → server

---

## 5. Deployment
Projekt on üles laaditud **Renderisse**:

- **Frontend:** React production build  
- **Backend:** Bun (installitakse buildis render.yaml abil)  
- **Keskkonnamuutujad:**
  - `PORT=3001`
  - `ADMIN_JWT_SECRET=<random-string>`

Rakendus on avalikult kasutatav — broneeringud toimivad ning admin saab neid hallata.

---

## 6. Lühike kokkuvõte
Dream Barber on terviklik broneerimissüsteem, mis demonstreerib:

- korrektset klient–server arhitektuuri  
- MVC‑stiilis rakenduse ülesehitust  
- topeltbroneeringute vältimist (äriloogika + SQLite UNIQUE)  
- turvalist admin‑paneeli JWT autentimisega  
- React UI + Bun backend kombinatsiooni  
- edukat deployment’i Renderisse  

Süsteem on kasutatav nii tavakasutajale (broneerimine) kui administraatorile (halduspaneel).
