# Docs Chat Server (Gemini)

This backend powers the floating documentation assistant in the Hugo site.

## 1) Install

```bash
cd server
npm install
```

## 2) Configure

```bash
cp .env.example .env
```

Set values in `.env`:
- `GEMINI_API_KEY`: your Google Gemini API key
- `GEMINI_MODEL`: Gemini model id (default `gemini-2.0-flash`)
- `GEMINI_API_VERSION`: API version path (`v1` recommended, default `v1`)
- `PORT`: backend port (default `3001`)
- `DOCS_CONTENT_DIR`: docs folder to index (default `../content`)
- `ALLOWED_ORIGIN`: use `*` for local testing, or set your exact site origin (example `http://localhost:1313`)

## 3) Run

```bash
npm run dev
```

If you previously hit `EMFILE: too many open files, watch`, run `npm run dev` again after pulling latest changes (the dev command now runs without file-watch mode).

Server endpoints:
- `GET /api/health`
- `POST /api/chat`

## 4) Hugo integration

The chat widget is already loaded through:
- `layouts/partials/chat.html`
- `layouts/partials/essentials/head.html`

You can configure in Hugo params (`config/_default/params.toml`):
- `docsChatApiUrl`
- `docsChatMaxMessageLength`

For production, set `docsChatApiUrl` to your deployed backend URL (or `/api/chat` if reverse proxied).

## Troubleshooting

- Error: `Invalid GEMINI_API_KEY in server/.env`
  - Generate a new key from Google AI Studio.
  - Ensure the Generative Language API is enabled for that key/project.
  - Update `server/.env` with `GEMINI_API_KEY=<your_real_key>`.
  - Restart backend: `npm run dev`.

- Error: `No compatible Gemini model found for this API key`
  - Set `GEMINI_MODEL=gemini-2.0-flash` in `server/.env`.
  - Keep `GEMINI_API_VERSION=v1`.
  - Restart backend: `npm run dev`.
