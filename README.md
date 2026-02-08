# Counter App

Jednoduchá aplikace počítadla s Next.js frontendem a Node.js backendem s MongoDB databází.

## 📁 Struktura projektu

```
.
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── config/    # Databázová konfigurace
│   │   ├── models/    # MongoDB modely
│   │   ├── routes/    # API endpointy
│   │   └── index.js   # Hlavní soubor serveru
│   ├── Dockerfile
│   └── package.json
│
└── frontend/          # Next.js aplikace
    ├── src/
    │   ├── app/       # Next.js 14 App Router
    │   └── components/# React komponenty
    ├── Dockerfile
    └── package.json
```

## 🚀 Rychlý start

### Lokální vývoj

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Upravte .env soubor s vaší MongoDB URI
npm run dev
```

Backend poběží na `http://localhost:3001`

#### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Ujistěte se, že NEXT_PUBLIC_API_URL ukazuje na backend
npm run dev
```

Frontend poběží na `http://localhost:3000`

### Docker Compose (lokální testování)

```bash
docker-compose up -d
```

Toto spustí:
- MongoDB na portu 27017
- Backend API na portu 3001

## 🌐 Deployment

### Backend na Hetzner s Coolify

1. **V Coolify vytvořte novou aplikaci:**
   - Typ: Docker Compose nebo Dockerfile
   - Repository: váš Git repo
   - Build Path: `/backend`

2. **Nastavte environment proměnné v Coolify:**
   ```
   PORT=3001
   MONGODB_URI=mongodb://mongodb:27017/counter-app
   NODE_ENV=production
   CORS_ORIGIN=https://vase-domena.vercel.app
   ```

3. **Pro Docker Compose deployment:**
   - Použijte `docker-compose.yml` v rootu projektu
   - Coolify automaticky nastaví networking mezi službami

4. **Získejte URL vašeho backendu** (např. `https://api.vase-domena.com`)

### Frontend na Vercel

1. **Importujte projekt do Vercel:**
   - Připojte váš Git repository
   - Framework Preset: Next.js
   - Root Directory: `frontend`

2. **Nastavte environment proměnné:**
   ```
   NEXT_PUBLIC_API_URL=https://api.vase-domena.com
   ```

3. **Deploy!** Vercel automaticky buildne a deployne aplikaci

## 🔧 API Endpointy

### GET `/api/counter`
Získá aktuální hodnotu počítadla
```json
Response: { "value": 0 }
```

### POST `/api/counter/increment`
Zvýší počítadlo o 1
```json
Response: { "value": 1 }
```

### POST `/api/counter/decrement`
Sníží počítadlo o 1
```json
Response: { "value": -1 }
```

### GET `/health`
Health check endpoint
```json
Response: { "status": "ok" }
```

## 🛠 Technologie

### Backend
- Node.js + Express
- MongoDB + Mongoose
- CORS middleware
- Docker

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Docker

## 📝 Poznámky

- Backend používá jeden globální counter s ID 'main'
- Frontend automaticky načte hodnotu při startu
- Všechny změny se okamžitě ukládají do MongoDB
- CORS je nakonfigurován pro bezpečné volání z frontendu

## 🐛 Troubleshooting

**Backend nemůže připojit k MongoDB:**
- Zkontrolujte MONGODB_URI v .env souboru
- Ujistěte se, že MongoDB běží
- V Docker Compose zkontrolujte, že služby jsou ve stejné síti

**Frontend nemůže volat API:**
- Zkontrolujte NEXT_PUBLIC_API_URL
- Ujistěte se, že backend běží
- Zkontrolujte CORS_ORIGIN v backend .env

**CORS chyby:**
- Nastavte CORS_ORIGIN na backendu na URL vašeho frontendu
- Pro vývoj můžete použít `*` ale NE v produkci

## 📄 Licence

MIT
