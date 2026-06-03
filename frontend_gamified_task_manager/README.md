# Gamified Task Manager (Frontend)

Vite + React + Tailwind app for the Gamified Task Manager.

## Quickstart

```bash
npm install
npm run dev
```

## Tests

This project uses **Vitest** + **React Testing Library** for basic automated tests.

### Run tests (CI-like, non-interactive)

```bash
npm test
```

### Run tests in watch mode (local dev)

```bash
npm run test:watch
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

This app only uses `VITE_PORT` for convenience; the rest will be wired in later steps if/when backend integration is needed.
