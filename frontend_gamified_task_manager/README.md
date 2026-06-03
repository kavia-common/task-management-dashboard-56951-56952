# Gamified Task Manager (Frontend)

Vite + React + Tailwind app for the Gamified Task Manager.

## Quickstart

```bash
npm install
npm run dev
```

## Environment variables

The container provides these variables (via `.env` in this environment):

- `VITE_API_BASE`
- `VITE_BACKEND_URL`
- `VITE_FRONTEND_URL`
- `VITE_WS_URL`
- `VITE_NODE_ENV`
- `VITE_NEXT_TELEMETRY_DISABLED`
- `VITE_ENABLE_SOURCE_MAPS`
- `VITE_PORT`

This step (01.00) only uses `VITE_PORT` for convenience; the rest will be wired in later steps if/when backend integration is needed.
