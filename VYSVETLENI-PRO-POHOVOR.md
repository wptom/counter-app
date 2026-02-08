# 📚 Vysvětlení Counter Aplikace - Pro Pohovor

## 🎯 Co aplikace dělá?

Jednoduchá webová aplikace, kde uživatel klikne na tlačítko **+** nebo **−** a počítadlo se zvýší nebo sníží. Hodnota se **ukládá do databáze**, takže když stránku obnovíte, číslo zůstane stejné.

---

## 🏗️ Architektura (Jak je to postavené)

Aplikace má **3 hlavní části**:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  FRONTEND   │────────▶│   BACKEND   │────────▶│  DATABÁZE   │
│  (Vercel)   │◀────────│  (Coolify)  │◀────────│ (PostgreSQL)│
└─────────────┘         └─────────────┘         └─────────────┘
   Next.js                 Node.js                 PostgreSQL
   React                   Express
   Tailwind

Uživatel                  API Server              Uložená data
```

### 1. **Frontend** - Co uživatel vidí
- **Technologie:** Next.js 14 + React + TypeScript + Tailwind CSS
- **Hosting:** Vercel
- **URL:** https://counter-app-wptom.vercel.app
- **Úkol:** Zobrazit číslo a tlačítka, komunikovat s backendem

### 2. **Backend** - Server a logika
- **Technologie:** Node.js + Express
- **Hosting:** Coolify na Hetzner VPS
- **URL:** https://counter-app-backend.sramekdesign.com
- **Úkol:** Přijímat požadavky od frontendu, komunikovat s databází

### 3. **Databáze** - Kde se ukládají data
- **Technologie:** PostgreSQL
- **Hosting:** Coolify na stejném VPS jako backend
- **Úkol:** Trvale uložit hodnotu počítadla

---

## 🔄 Jak to funguje? (Flow aplikace)

### Když uživatel otevře stránku:

1. **Prohlížeč** načte frontend z Vercel
2. **Frontend** pošle HTTP GET request na backend: `/api/counter`
3. **Backend** se zeptá databáze: "Jaká je aktuální hodnota?"
4. **Databáze** odpoví: `{"value": 5}`
5. **Backend** pošle odpověď frontendu
6. **Frontend** zobrazí číslo **5**

### Když uživatel klikne na tlačítko **+**:

1. **Frontend** pošle HTTP POST request na backend: `/api/counter/increment`
2. **Backend** řekne databázi: "Zvyš hodnotu o 1"
3. **Databáze** provede: `UPDATE counter SET value = value + 1`
4. **Databáze** vrátí novou hodnotu: `{"value": 6}`
5. **Backend** pošle odpověď frontendu: `{"value": 6}`
6. **Frontend** aktualizuje zobrazení na **6**

---

## 📁 Struktura Projektu

```
counter-app/
│
├── backend/                    # Server-side aplikace
│   ├── src/
│   │   ├── index.js           # Hlavní server soubor
│   │   ├── config/
│   │   │   └── database.js    # PostgreSQL připojení
│   │   ├── models/
│   │   │   └── Counter.js     # Logika pro práci s počítadlem
│   │   └── routes/
│   │       └── counter.js     # API endpointy
│   ├── package.json           # Závislosti (Express, pg, cors, dotenv)
│   └── Dockerfile             # Instrukce pro Docker container
│
└── frontend/                   # Client-side aplikace
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx     # Základní layout stránky
    │   │   ├── page.tsx       # Hlavní stránka
    │   │   └── globals.css    # Tailwind CSS styly
    │   └── components/
    │       └── Counter.tsx    # Komponenta počítadla
    ├── package.json           # Závislosti (React, Next.js)
    └── Dockerfile             # Pro případný Docker build
```

---

## 🔧 Backend - Jak funguje server

### `src/index.js` - Hlavní server

```javascript
// Toto je "srdce" serveru
const express = require('express');      // Framework pro vytvoření API
const cors = require('cors');            // Umožňuje frontendu volat API
const { initDB } = require('./config/database');  // Připojení k databázi

const app = express();

// Middleware - věci, které se spustí před každým requestem
app.use(cors());           // Povolit cross-origin requesty
app.use(express.json());   // Umět číst JSON data

// Inicializovat databázi (vytvoří tabulku, pokud neexistuje)
initDB();

// Routing - odkud kam jdou requesty
app.use('/api/counter', counterRoutes);  // Všechny /api/counter/* jdou do counterRoutes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Spustit server na portu 3001
app.listen(3001);
```

**Co se tady děje:**
- Express vytvoří server
- CORS povolí Vercel frontendu volat tento backend
- Server poslouchá na portu 3001
- Když přijde request na `/api/counter`, pošle ho do `counterRoutes`

---

### `src/config/database.js` - Připojení k PostgreSQL

```javascript
const { Pool } = require('pg');  // PostgreSQL klient

// Pool = správce připojení k databázi
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // URL z environment proměnné
  ssl: false  // Vypnuto, protože Coolify interní síť nepotřebuje SSL
});

// Inicializace - vytvoří tabulku, pokud neexistuje
const initDB = async () => {
  // SQL příkaz: Vytvoř tabulku "counter"
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id VARCHAR(50) PRIMARY KEY,      -- Identifikátor (vždy 'main')
      value INTEGER NOT NULL DEFAULT 0, -- Hodnota počítadla
      updated_at TIMESTAMP              -- Čas poslední změny
    )
  `);
  
  // Vložit výchozí záznam s hodnotou 0
  await pool.query(`
    INSERT INTO counter (id, value)
    VALUES ('main', 0)
    ON CONFLICT (id) DO NOTHING  -- Pokud už existuje, nedělej nic
  `);
};
```

**Co se tady děje:**
- `Pool` = efektivní způsob, jak spravovat více spojení k databázi najednou
- `initDB()` při startu vytvoří tabulku a výchozí záznam
- `ON CONFLICT DO NOTHING` = pokud záznam existuje, nepřepisuj ho

---

### `src/models/Counter.js` - Logika práce s počítadlem

```javascript
const { pool } = require('../config/database');

class Counter {
  // Získat aktuální hodnotu
  static async getCounter() {
    const result = await pool.query(
      'SELECT value FROM counter WHERE id = $1',
      ['main']
    );
    return result.rows[0];  // Vrátí: { value: 5 }
  }

  // Zvýšit o 1
  static async increment() {
    const result = await pool.query(
      'UPDATE counter SET value = value + 1 WHERE id = $1 RETURNING value',
      ['main']
    );
    return result.rows[0];  // Vrátí: { value: 6 }
  }

  // Snížit o 1
  static async decrement() {
    const result = await pool.query(
      'UPDATE counter SET value = value - 1 WHERE id = $1 RETURNING value',
      ['main']
    );
    return result.rows[0];  // Vrátí: { value: 4 }
  }
}
```

**Co se tady děje:**
- `$1` = placeholder pro parametr (bezpečné proti SQL injection)
- `RETURNING value` = SQL příkaz vrátí novou hodnotu po UPDATE
- `async/await` = čekáme na odpověď z databáze
- `result.rows[0]` = první (a jediný) výsledek z databáze

---

### `src/routes/counter.js` - API Endpointy

```javascript
const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter');

// GET /api/counter - Vrátí aktuální hodnotu
router.get('/', async (req, res) => {
  try {
    const counter = await Counter.getCounter();
    res.json({ value: counter.value });  // Odpověď: {"value": 5}
  } catch (error) {
    res.status(500).json({ error: 'Chyba při načítání' });
  }
});

// POST /api/counter/increment - Zvýší o 1
router.post('/increment', async (req, res) => {
  try {
    const counter = await Counter.increment();
    res.json({ value: counter.value });  // Odpověď: {"value": 6}
  } catch (error) {
    res.status(500).json({ error: 'Chyba při zvyšování' });
  }
});

// POST /api/counter/decrement - Sníží o 1
router.post('/decrement', async (req, res) => {
  try {
    const counter = await Counter.decrement();
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při snižování' });
  }
});

module.exports = router;
```

**Co se tady děje:**
- `router` = mini aplikace, která řeší requesty pro `/api/counter`
- `try/catch` = ošetření chyb (pokud něco selže, nepadne celý server)
- `res.json()` = pošle JSON odpověď zpátky frontendu
- `res.status(500)` = HTTP kód 500 = server error

---

## 🎨 Frontend - Jak funguje uživatelské rozhraní

### `src/app/page.tsx` - Hlavní stránka

```typescript
'use client'  // Next.js direktiva: Toto je client-side komponenta

import Counter from '@/components/Counter'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Counter />
    </main>
  )
}
```

**Co se tady děje:**
- `'use client'` = tato komponenta běží v prohlížeči (ne na serveru)
- Tailwind classes: `min-h-screen` (výška obrazovky), `flex` (flexbox layout), `items-center` (vystředit)
- Renderuje komponentu `<Counter />`

---

### `src/components/Counter.tsx` - Logika počítadla

```typescript
'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL  // Z Vercel env variables

export default function Counter() {
  // React State - proměnné, které když se změní, komponenta se překreslí
  const [count, setCount] = useState<number>(0)       // Aktuální hodnota
  const [loading, setLoading] = useState<boolean>(false)  // Načítá se?
  const [error, setError] = useState<string | null>(null) // Chybová hláška

  // useEffect - spustí se při načtení komponenty
  useEffect(() => {
    fetchCounter()  // Načti hodnotu z backendu
  }, [])  // [] = spustí se jen jednou při načtení

  // Funkce pro načtení hodnoty z API
  const fetchCounter = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter`)
      const data = await response.json()
      setCount(data.value)  // Aktualizuj state
    } catch (err) {
      setError('Nelze načíst počítadlo')
    }
  }

  // Funkce pro zvýšení
  const handleIncrement = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/counter/increment`, {
        method: 'POST',
      })
      const data = await response.json()
      setCount(data.value)  // Aktualizuj zobrazení
    } catch (err) {
      setError('Nelze zvýšit počítadlo')
    } finally {
      setLoading(false)
    }
  }

  // Funkce pro snížení (stejná logika)
  const handleDecrement = async () => {
    // ... stejné jako increment, jen volá /decrement
  }

  // JSX - HTML-like syntaxe pro UI
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Počítadlo
      </h1>
      
      {/* Zobrazení čísla */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8">
        <div className="text-7xl font-bold text-center text-white">
          {count}
        </div>
      </div>

      {/* Chybová hláška */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tlačítka */}
      <div className="flex gap-4">
        <button
          onClick={handleDecrement}
          disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg"
        >
          −
        </button>
        
        <button
          onClick={handleIncrement}
          disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
```

**Co se tady děje:**
- **useState** = React hook pro uchování stavu (proměnné, které se můžou měnit)
- **useEffect** = spustí se při načtení komponenty (podobné jako `onload`)
- **fetch** = prohlížečová funkce pro HTTP requesty
- **async/await** = čeká na odpověď ze serveru
- **Tailwind classes** = utility CSS classes (bg-red-500 = červené pozadí, rounded-lg = zaoblené rohy)
- **disabled={loading}** = tlačítko je neaktivní během načítání

---

## 🔗 Jak se to propojuje?

### 1. Environment Variables (Propojení Frontend ↔ Backend)

**Vercel (Frontend):**
```
NEXT_PUBLIC_API_URL=https://counter-app-backend.sramekdesign.com
```
- Frontend ví, kam má posílat requesty

**Coolify (Backend):**
```
DATABASE_URL=postgres://user:pass@host:5432/postgres
CORS_ORIGIN=https://counter-app-wptom.vercel.app
PORT=3001
```
- Backend ví, kde je databáze
- CORS povolí jen requesty z vašeho frontendu

### 2. REST API (Komunikační protokol)

Frontend a Backend komunikují přes **HTTP requesty**:

| Metoda | Endpoint | Co dělá | Response |
|--------|----------|---------|----------|
| GET | `/api/counter` | Získá hodnotu | `{"value": 5}` |
| POST | `/api/counter/increment` | Zvýší o 1 | `{"value": 6}` |
| POST | `/api/counter/decrement` | Sníží o 1 | `{"value": 4}` |
| GET | `/health` | Server OK? | `{"status":"ok"}` |

### 3. Databáze (PostgreSQL)

Tabulka v databázi:
```sql
counter
├── id: 'main'              -- Identifikátor
├── value: 5                -- Aktuální hodnota
└── updated_at: 2026-02-08  -- Čas poslední změny
```

---

## 🚀 Deployment (Jak to běží v produkci)

### Frontend na Vercel

1. **Push do GitHub** → Vercel automaticky detekuje změny
2. **Build Process:**
   - Vercel stáhne kód z GitHubu
   - Spustí `npm install` (nainstaluje závislosti)
   - Spustí `npm run build` (zkompiluje Next.js)
   - Optimalizuje obrázky, CSS, JavaScript
3. **Deploy:**
   - Nahraje na Vercel CDN (Content Delivery Network)
   - Aplikace je dostupná na HTTPS automaticky
   - Global edge network = rychlé načítání po celém světě

### Backend na Coolify (Hetzner VPS)

1. **Push do GitHub** → Ručně klikneme "Redeploy" v Coolify
2. **Build Process:**
   - Coolify stáhne kód z GitHubu
   - Spustí `docker build` (vytvoří Docker container)
   - Dockerfile provede:
     ```dockerfile
     FROM node:18-alpine      # Základní Node.js obraz
     WORKDIR /app             # Pracovní složka
     COPY package*.json ./    # Zkopíruj package.json
     RUN npm install --production  # Nainstaluj závislosti
     COPY . .                 # Zkopíruj veškerý kód
     CMD ["npm", "start"]     # Spusť server
     ```
3. **Deploy:**
   - Docker container běží na VPS
   - Nginx reverse proxy poskytuje HTTPS
   - Let's Encrypt automaticky generuje SSL certifikát

### PostgreSQL na Coolify

- Docker container s PostgreSQL
- Data uložena v persistent volume (přežije restart)
- Interní síť v rámci Coolify (backend se může připojit)

---

## 🔐 Bezpečnost

### CORS (Cross-Origin Resource Sharing)
```javascript
app.use(cors({
  origin: 'https://counter-app-wptom.vercel.app'
}));
```
- Povoluje jen requesty z vašeho frontendu
- Chrání před neoprávněným přístupem

### HTTPS/SSL
- Všechna komunikace šifrovaná
- Let's Encrypt certifikáty zdarma
- Prohlížeč zobrazí zámek 🔒

### Environment Variables
- Citlivé údaje (hesla, URL) nejsou v kódu
- Uložená bezpečně na Vercel/Coolify
- Nikdy ne v GitHubu

### SQL Injection Protection
```javascript
pool.query('SELECT * FROM counter WHERE id = $1', ['main'])
```
- `$1` = parametrizovaný dotaz
- PostgreSQL `pg` knihovna automaticky escapuje hodnoty

---

## 📊 Výhody této architektury

### Scalabilita
- **Frontend (Vercel):** Automaticky škáluje při vysoké návštěvnosti
- **Backend:** Můžete snadno přidat více serverů v Coolify

### Separace concerns (Oddělení zodpovědností)
- Frontend = UI/UX
- Backend = Business logika
- Databáze = Persistent storage

### Flexibilita
- Můžete změnit frontend bez změny backendu (a naopak)
- Můžete přidat mobilní aplikaci, která bude volat stejné API

### Development Experience
- **TypeScript** = type safety, méně chyb
- **Tailwind** = rychlý CSS vývoj
- **Hot reload** = změny viditelné okamžitě

---

## 🎤 Klíčové fráze pro pohovor

### O architektuře:
> *"Použili jsme **moderní třívrstvou architekturu** - frontend v Next.js na Vercelu, backend v Node.js/Express na vlastním VPS přes Coolify, a PostgreSQL jako relační databázi. Všechny části komunikují přes **RESTful API** a jsou **nezávisle škálovatelné**."*

### O technologiích:
> *"Frontend je postaven na **Next.js 14 s App Routerem**, což umožňuje jak server-side tak client-side rendering. Pro styling používáme **Tailwind CSS** - utility-first framework pro rychlý vývoj. Backend je **Node.js s Express frameworkem** - jednoduchý, ale výkonný pro REST API. A **PostgreSQL** pro databázi - stabilní, ACID compliant, open-source."*

### O deploymentu:
> *"Frontend deployujeme na **Vercel** - automatický CI/CD pipeline, push do GitHubu spustí build a deploy. Backend běží na **Hetzner VPS** přes **Coolify** - self-hosted alternativa k Heroku. Používáme **Docker containers** pro izolaci a reprodukovatelnost. **Let's Encrypt** automaticky spravuje SSL certifikáty."*

### O bezpečnosti:
> *"Implementovali jsme **CORS policy**, která povoluje requesty jen z našeho frontendu. Veškerá komunikace běží přes **HTTPS**. Používáme **parametrizované SQL dotazy** proti SQL injection. Citlivá data jsou v **environment variables**, nikoliv v kódu."*

### O výhodách:
> *"Tato architektura je **škálovatelná** - Vercel automaticky škáluje frontend při vysoké zátěži. Je **maintainable** - oddělená zodpovědnost jednotlivých částí. A **flexibilní** - můžeme snadno přidat mobilní app nebo další frontend, který bude používat stejné API."*

---

## 💡 Pro prohloubení znalostí

### Co byste mohli zlepšit (pro pokročilejší pohovor):

1. **Caching**
   - Redis pro cache častých dotazů
   - Snížení zátěže databáze

2. **Monitoring**
   - Sentry pro error tracking
   - Grafana + Prometheus pro metriky

3. **Testing**
   - Unit testy (Jest)
   - Integration testy (Supertest)
   - E2E testy (Playwright)

4. **Authentication**
   - Každý uživatel vlastní počítadlo
   - JWT tokens nebo NextAuth.js

5. **Rate Limiting**
   - Ochrana proti spamu
   - Express-rate-limit middleware

---

## ✅ Shrnutí pro rychlé zopakování

**Co aplikace dělá:** Counter s tlačítky +/-, data se ukládají do databáze

**Jak to funguje:**
1. Frontend (Next.js) zobrazí UI
2. Uživatel klikne na tlačítko
3. Frontend pošle HTTP request na backend
4. Backend upraví data v PostgreSQL
5. Backend vrátí novou hodnotu
6. Frontend aktualizuje zobrazení

**Technologie:**
- **Frontend:** Next.js + React + TypeScript + Tailwind
- **Backend:** Node.js + Express + PostgreSQL
- **Deployment:** Vercel (frontend) + Coolify/Hetzner (backend)

**Proč tyto technologie:**
- **Next.js:** Moderní, rychlý, SEO friendly
- **Express:** Jednoduchý, flexibilní, velká komunita
- **PostgreSQL:** Stabilní, ACID, open-source
- **Vercel:** Automatický deploy, edge network, zdarma
- **Coolify:** Self-hosted, plná kontrola, levné

---

**Hodně štěstí na pohovoru! 🍀**
