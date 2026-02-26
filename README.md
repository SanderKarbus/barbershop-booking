
## Dream Barber – juuksurisalongi broneerimissüsteem (Bun + JS + SQLite)

Avalik URL: ("Placeholder")
Admin: kasutaja admin, parool admin123

### Klient–server tööpõhimõte
Süsteem kasutab klassikalist klient–server mudelit:

Frontend (avalik veebileht) saadab päringuid JavaScripti abil REST‑API lõpp‑punktidesse (/api/hairdressers, /api/availability, /api/booking).
Server (Bun runtime) töötleb need päringud, kontrollib andmeid, suhtleb SQLite andmebaasiga ning tagastab vastused JSON kujul.
Kui kasutaja broneerib aja, teeb browser POST päringu serverisse, server valideerib sisendid, kontrollib vabu aegu, salvestab broneeringu ja tagastab vastuse, mille põhjal frontend kuvab kinnituse või vea.

Selline ülesehitus tagab selge liigenduse kasutajaliidese ja äriloogika vahel.

### Arhitektuur ja raamistikulaadne lähenemine
Projekt kasutab Bun runtime’i ning modulaarset failistruktuuri, mis toimib nagu raamistikulaadne MVC arhitektuur:

- controllers/ – API päringute käsitlemine (kontrolleri roll)
- models/ – andmebaasi operatsioonid ja äriloogika (mudeli roll)
- views/ / frontend/public – HTML, CSS, JS (vaate roll)
- backend/server.js – serveri konfiguratsioon, routing ja päringute suunamine
- config/ – konfiguratsioonid, muutujaid, seadistused

Selline jaotus vastab MVC põhimõtetele:
vaade – frontend,
mudel – SQLite‑l põhinev andmekiht,
kontroller – päringute töötlemise funktsioonid.

### Andmete liikumine ja töötlus
Broneerimisel toimub järgmine töövoog:

1. Kasutaja valib juuksuri, kuupäeva, aja ning täidab kontaktandmed.
2. Frontend teeb POST /api/booking.
3. Backend kontrollib:
	 - kas väljad on täidetud
	 - kas aeg on formaadiliselt korrektne
	 - kas aeg on tööaegade (09:00–17:00) vahel
	 - kas sama juuksur pole juba samaks ajaks broneeritud

Kui kõik on korras, salvestatakse broneering SQLite andmebaasi.
Server tagastab vastuse, mida frontend kasutab kinnituse kuvamiseks.

See protsess hõlmab andmete kogumist, valideerimist, äriloogikat ja otsustamist talletamise üle.

### Topeltbroneeringu vältimine (kohustuslik nõue)
Süsteemis on kasutusel kaks taset topeltbroneeringute vältimiseks:

- Serveripoolne kontroll – enne salvestust kontrollitakse, kas sama juuksuri sama kuupäeva ja kellaaja kohta pole broneeringut.
- SQLite UNIQUE piirang:
	UNIQUE(hairdresser_id, date, start_time)

See tagab, et isegi samaaegsete päringute korral ei saa topeltbroneeringut salvestada.

Seega on nõue täidetud nii loogika kui andmebaasi tasandil.

### Admin-vaade ja turvalisus
Admin laiendab tavakasutaja võimalusi:

- broneeringute nimekiri kuupäeva järgi
- iga broneeringu detailid (juuksur, klient, telefon, email, lisainfo)
- võimalus broneeringuid kustutada
- eraldiseisev sisselogimine (admin / admin123)
- API lõpp‑punktid on kaitstud tokeni või põhiloogika kaudu

Admin-liides on kaitstud volitamata ligipääsu eest ning vastab töö nõudmistele.

### Turvariskid ja nende maandamine
- **SQL injection**

	Päringud on parametreeritud ning sisendid valideeritud.

- **XSS (Cross-Site Scripting)**

	Server saadab JSON-i, frontend ei renderda ohtlikku HTML-i.
	Kõik sisendväljad on serveris puhastatud.

- **Autoriseerimata ligipääs**

	Admin API nõuab sisse logimist.
	Admin-vaade pole avalik.

- **Topeltbroneeringud**

	Lahendatud äriloogikas ja SQLite UNIQUE piiranguga.

Kõik põhilised turvameetmed on õpiväljundite jaoks olemas.

### Koodistandard ja projekti kvaliteet
Projekt järgib ühtset ja loetavat koodipõhimõtet:

- failid eraldi kaustades (controllers, models, backend, frontend)
- korduvkasutatavad komponendid (valideerimine, mudelid)
- funktsioonid ja muutujad selgete nimedega
- HTML/CSS ühe stiiliga, kaasaegne disain
- täielik lahusus frontend–backend rollide vahel

Kood on järjepidev ja vastab kaasaegse JS/Bun projekti standarditele.

# BookBarber – Juuksurisalongi broneerimissüsteem

## Klient-server, backend/frontend
Kasutaja suhtleb React-põhise veebiliidesega (frontend), mis saadab päringud Node.js/Express serverile (backend). Backend töötleb päringud, kontrollib ja salvestab andmed SQLite andmebaasi ning tagastab tulemuse frontendile.

## Kasutatud raamistik
Backend: Express (Node.js), Frontend: React + MUI. Express võimaldab kiiret REST API loomist, React võimaldab moodulipõhist, kaasaegset kasutajaliidest. MVC printsiip: controllers (päringud), models (andmed), views (React komponendid).

## Turvalisuse riskid ja kaitsemeetmed

## Koodistandard
Projekt järgib järjepidevat failistruktuuri, selgeid nimesid ja kommentaare. Kogu kood on loetav, moodulipõhine ja vastab kaasaegsetele JavaScripti/Reacti parimatele praktikatele.

## Käivitamine ja paigaldus
1. Paigalda sõltuvused: `npm install` (juurkaustas ja frontend kaustas)
2. Initsialiseeri andmebaas: `node backend/init-db.js`
3. Loo admin: `node backend/create-admin.js admin admin123`
4. Käivita backend: `npm run dev`
5. Käivita frontend: `cd frontend && npm start`

## Avalik URL
Lisa siia, kui rakendus on üles laetud (nt https://bookbarber.example.com)

Lisainfo: Vaata kausta .github/copilot-instructions.md
