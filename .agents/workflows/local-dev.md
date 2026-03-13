---
description: How to start the TrackCodex project locally for development
---

# Local Development Startup

## Prerequisites
- Docker Desktop must be running (check the system tray icon)
- Node.js and npm must be installed

## Steps

### 1. Start the PostgreSQL Database (Docker)
// turbo
```
docker-compose up -d db
```
Wait ~5 seconds for PostgreSQL to be ready.

### 2. Run Prisma Database Migrations
// turbo
```
npx prisma db push --schema=backend/schema.prisma
```
This creates the required database tables on first run.

### 3. Start Both Frontend + Backend Together
// turbo
```
npm run start:all
```
This starts:
- **Backend** (Fastify) on `http://localhost:4000`
- **Frontend** (Vite) on `http://localhost:3001`

Wait until you see:
- `🚀 TrackCodex Backend operational on port 4000`
- `✅ Connected to PostgreSQL database successfully`

### 4. Open the App
Navigate to **http://localhost:3001** in your browser.

> **Important**: Use port `3001`, NOT `5173`. The Vite config sets port 3001 and includes a proxy that forwards `/api` requests to the backend on port 4000 automatically.

### 5. Login
Since Firebase keys are not configured locally, use any email format (e.g., `dev@test.com`) with any password. The mock login will let you in.

## Troubleshooting

### Backend crashes immediately
- Ensure `.env` file exists in the project root with all required variables
- Ensure Docker Desktop is running and the `db` container is up

### "Network Error" on Create Repository
- Ensure the backend is running (check terminal for `port 4000` message)
- Ensure you're on `localhost:3001` (not 5173)

### Black screen
- Hard refresh with `Ctrl + F5`
