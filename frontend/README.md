# Counter Frontend

Next.js 14 frontend aplikace s Tailwind CSS pro counter app.

## 🚀 Instalace a spuštění

### Lokální vývoj

```bash
# Instalace závislostí
npm install

# Kopírovat environment soubor
cp .env.local.example .env.local

# Upravit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Spustit dev server
npm run dev
```

Aplikace poběží na `http://localhost:3000`

### Produkce

```bash
npm run build
npm start
```

## 🎨 Komponenty

### Counter
Hlavní komponenta s počítadlem
- Zobrazuje aktuální hodnotu
- Tlačítka pro přidání/odebrání
- Tlačítko pro obnovení hodnoty
- Zobrazení chyb
- Loading stavy

## 🔧 Environment proměnné

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Pro produkci nastavte na URL vašeho backendu (např. `https://api.vase-domena.com`)

## 📁 Struktura

```
src/
├── app/
│   ├── globals.css    # Tailwind styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Domovská stránka
└── components/
    └── Counter.tsx    # Counter komponenta
```

## 🌐 Deployment na Vercel

### Automatický deployment

1. Pushnout do Git repository
2. Importovat projekt do Vercel
3. Nastavit:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Environment Variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

### Manuální deployment

```bash
npm run build
vercel --prod
```

## 🎨 Tailwind CSS

Projekt používá Tailwind CSS pro styling:
- Responsive design
- Dark mode podpora
- Gradient backgrounds
- Animace a transitions

## 📝 Poznámky

- Používá Next.js 14 App Router
- Client-side komponenty pro interaktivitu
- TypeScript pro type safety
- Automatické načtení hodnoty při startu
