# 🎄 Kerstlootjes Trek 🎁

Een complete applicatie voor het trekken van kerstlootjes met Vue.js frontend en NestJS backend.

## Features

✅ Unieke links per gebruiker
✅ Verlanglijstjes met items, beschrijvingen en links
✅ Random lootjes trekken
✅ Privacy: alleen eigen lijstje en getrokken persoon zichtbaar
✅ Responsive design
✅ Docker containerized
✅ Cloudflare tunnel voor externe toegang

## Installatie

### Lokaal development

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker Deployment (Raspberry Pi)

1. **Setup Cloudflare Tunnel**
```bash
# Installeer cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
sudo mv cloudflared /usr/local/bin/
sudo chmod +x /usr/local/bin/cloudflared

# Login en maak tunnel
cloudflared tunnel login
cloudflared tunnel create kerstlootjes
```

2. **Configureer .env**
```bash
# Pas .env aan met je tunnel token
nano .env
```

3. **Start applicatie**
```bash
# Build en start
docker-compose up -d

# Bekijk logs
docker-compose logs -f

# Stop
docker-compose down
```

## Gebruik

1. Maak een groep aan (bijv. "Kerst 2025")
2. Voeg alle deelnemers toe
3. Deel de unieke links met elke deelnemer
4. Trek de lootjes wanneer iedereen toegevoegd is
5. Deelnemers kunnen hun verlanglijstje invullen en zien wie ze hebben getrokken

## Structuur

```
kerstlootjes/
├── backend/          # NestJS backend
├── frontend/         # Vue.js frontend
├── docker-compose.yml
└── .env
```

## Technologieën

- **Frontend:** Vue.js 3, TypeScript, Vite
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Deployment:** Docker, Cloudflare Tunnel
- **Database:** PostgreSQL

## License

MIT
