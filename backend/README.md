# Counter Backend API

Node.js/Express backend s MongoDB pro jednoduchou counter aplikaci.

## 🚀 Instalace a spuštění

### Lokální vývoj

```bash
# Instalace závislostí
npm install

# Kopírovat environment soubor
cp .env.example .env

# Upravit .env s vaší MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/counter-app

# Spustit dev server
npm run dev
```

### Produkce

```bash
npm install --production
npm start
```

### Docker

```bash
docker build -t counter-backend .
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/counter-app \
  counter-backend
```

## 📡 API Endpointy

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | `/api/counter` | Získat aktuální hodnotu |
| POST | `/api/counter/increment` | Zvýšit o 1 |
| POST | `/api/counter/decrement` | Snížit o 1 |
| GET | `/health` | Health check |

## 🔧 Environment proměnné

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/counter-app
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 📁 Struktura

```
src/
├── config/
│   └── database.js    # MongoDB připojení
├── models/
│   └── Counter.js     # Counter model
├── routes/
│   └── counter.js     # Counter routes
└── index.js          # Hlavní server soubor
```

## 🌐 Deployment na Coolify

1. V Coolify vytvořte novou aplikaci typu "Dockerfile"
2. Nastavte build path na `backend/`
3. Přidejte environment proměnné
4. Deploy!

Coolify automaticky použije `Dockerfile` a spustí aplikaci.
