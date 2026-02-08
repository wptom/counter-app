# 🚀 Deployment Guide

Kompletní návod pro deployment backendu na Hetzner/Coolify a frontendu na Vercel.

## 📋 Příprava

### 1. Git Repository
Ujistěte se, že váš projekt je v Git repository (GitHub, GitLab, atd.):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 🖥️ Backend deployment na Coolify (Hetzner VPS)

### Krok 1: Příprava MongoDB

V Coolify:

1. Jděte do **Resources** → **Add Resource** → **Database**
2. Vyberte **MongoDB**
3. Vytvořte databázi s názvem např. `counter-mongodb`
4. Po vytvoření si poznamenejte **Connection String**
   - Bude vypadat nějak jako: `mongodb://username:password@mongodb:27017/counter-app`

### Krok 2: Vytvoření Backend aplikace

1. V Coolify jděte do **Resources** → **Add Resource** → **Application**

2. **Připojte Git repository:**
   - Vyberte váš Git provider (GitHub/GitLab)
   - Autorizujte Coolify
   - Vyberte repository

3. **Nastavení aplikace:**
   - **Name:** `counter-backend`
   - **Build Pack:** `Dockerfile`
   - **Base Directory:** `/backend`
   - **Dockerfile Location:** `/backend/Dockerfile`
   - **Port:** `3001`

4. **Environment Variables:**
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=<mongodb-connection-string-z-kroku-1>
   CORS_ORIGIN=*
   ```
   
   > 📝 CORS_ORIGIN později změňte na URL vašeho Vercel frontendu

5. **Klikněte na Deploy**

6. **Po úspěšném deploymentu:**
   - Poznamenejte si URL backendu (např. `https://counter-backend.your-domain.com`)
   - Otestujte: `curl https://your-backend-url.com/health`

### Alternativa: Docker Compose v Coolify

Místo samostatných služeb můžete použít Docker Compose:

1. Vytvořte aplikaci s **Build Pack: Docker Compose**
2. Coolify automaticky najde `docker-compose.yml` v rootu
3. Backend a MongoDB se spustí společně

## ☁️ Frontend deployment na Vercel

### Krok 1: Připojení projektu

1. Jděte na [vercel.com](https://vercel.com) a přihlaste se
2. Klikněte na **Add New...** → **Project**
3. Importujte váš Git repository
4. Vercel automaticky detekuje Next.js projekt

### Krok 2: Konfigurace

1. **Framework Preset:** Next.js (automaticky detekováno)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build` (výchozí)
4. **Output Directory:** `.next` (výchozí)

### Krok 3: Environment Variables

Přidejte environment proměnnou:

```
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.com
```

> ⚠️ Použijte URL vašeho backendu z Coolify!

### Krok 4: Deploy

1. Klikněte na **Deploy**
2. Počkejte na build a deployment (1-2 minuty)
3. Po dokončení získáte URL (např. `https://your-app.vercel.app`)

## 🔧 Finální konfigurace

### Aktualizace CORS na backendu

1. Vraťte se do Coolify k backend aplikaci
2. Upravte environment proměnnou:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
3. Restart aplikaci

### Test aplikace

1. Otevřete frontend URL ve prohlížeči
2. Měli byste vidět počítadlo na hodnotě 0
3. Klikněte na tlačítka + a - pro test funkčnosti

## 🔄 Automatické deploymenty

### Backend (Coolify)
- Každý push do vašeho Git repository automaticky spustí re-deploy
- Můžete nastavit webhook pro specifické branches

### Frontend (Vercel)
- Automaticky se deployuje při každém push do main/master branch
- Preview deployments pro pull requesty
- Instant rollbacks v případě problémů

## 🐛 Troubleshooting

### Backend nefunguje

1. **Zkontrolujte logy v Coolify:**
   - Resources → Vaše aplikace → Logs

2. **Časté problémy:**
   - MongoDB connection string je špatně
   - PORT není správně nastaven
   - Dockerfile má chyby

### Frontend nemůže kontaktovat backend

1. **CORS error:**
   - Zkontrolujte CORS_ORIGIN v backend env variables
   - Musí přesně odpovídat Vercel URL

2. **API URL error:**
   - Zkontrolujte NEXT_PUBLIC_API_URL v Vercel
   - Musí začínat s `https://`

3. **Zkontrolujte v prohlížeči:**
   - Otevřete Developer Tools → Network tab
   - Sledujte API requesty a jejich odpovědi

### MongoDB připojení selhává

1. **V Coolify zkontrolujte:**
   - MongoDB service běží
   - Connection string je správný
   - Backend a MongoDB jsou ve stejné síti

## 📊 Monitoring

### Coolify
- Built-in monitoring pro CPU, RAM, disk
- Logy v reálném čase
- Health checks

### Vercel
- Analytics dashboard
- Error reporting
- Performance metrics

## 💰 Náklady

### Hetzner VPS
- Začíná od ~€4/měsíc
- Coolify je free
- Doporučeno: minimálně 2GB RAM

### Vercel
- Free tier: dostačující pro většinu projektů
- Neomezené deployments
- 100GB bandwidth

### MongoDB
- Můžete použít MongoDB service v Coolify (free)
- Nebo MongoDB Atlas free tier (512MB)

## 🔐 Bezpečnost

1. **Nikdy necommitujte .env soubory**
2. **Používejte silné MongoDB credentials**
3. **CORS nastavte pouze na vaši doménu (ne \*)**
4. **Pravidelně aktualizujte dependencies**

## 📝 Checklist

- [ ] Git repository vytvořen a pushnut
- [ ] MongoDB vytvořena v Coolify
- [ ] Backend aplikace vytvořena v Coolify
- [ ] Backend environment variables nastaveny
- [ ] Backend úspěšně deploynut
- [ ] Backend URL otestované
- [ ] Frontend projekt importován do Vercel
- [ ] Frontend environment variables nastaveny
- [ ] Frontend úspěšně deploynut
- [ ] CORS aktualizován na backendu
- [ ] Aplikace otestována end-to-end

## 🎉 Hotovo!

Vaše aplikace je nyní live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.your-domain.com

Gratulujeme! 🚀
