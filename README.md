# snapURL - URL Shortener

Full-stack URL shortener built with React, Express, and MongoDB.

- Live App: https://snapurl-url-shortner.vercel.app/
- Frontend Folder: `FRONTEND/`
- Backend Folder: `BACKEND/`

## Features

- Create short URLs from long links
- Optional custom alias, password, and expiration
- Authentication with cookie-based sessions
- Dashboard analytics (total links, clicks, top links, recent links, traffic trend)
- Link management (list, details, stats, delete)
- Redirect support via short code route

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, Mongoose, JWT, Cookie Parser, Helmet, Morgan
- Database: MongoDB Atlas
- Deployment: Vercel and Render compatible

## Project Structure

```text
03 snapURL - URL-SHORTNER/
  BACKEND/
    app.js
    api/index.js
    vercel.json
    src/
  FRONTEND/
    src/
    public/
    vercel.json
  vercel.json
```

## Local Development

### 1) Backend Setup

```bash
cd BACKEND
npm install
```

Create `BACKEND/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ALLOW_MEMORY_DB_FALLBACK=true
```

Run backend:

```bash
npm run dev
```

Backend default URL: `http://localhost:3000`

### 2) Frontend Setup

```bash
cd FRONTEND
npm install
```

Create `FRONTEND/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Environment Variables

Backend (`BACKEND/.env`):

- `MONGODB_URI` (or `MONGO_URI`)
- `JWT_SECRET`
- `APP_URL`
- `FRONTEND_URL` or `FRONTEND_URLS` (comma-separated origins)
- `PORT` (optional, defaults to `3000`)
- `ALLOW_MEMORY_DB_FALLBACK` (optional)

Frontend (`FRONTEND/.env`):

- `VITE_API_URL`
- `VITE_APP_URL`

## API Overview

Base API path: `/api`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (protected)

Short URLs:

- `POST /api/short_url/create`
- `GET /api/short_url/my-urls` (protected)
- `GET /api/short_url/:id` (protected)
- `PATCH /api/short_url/:id` (protected)
- `DELETE /api/short_url/:id` (protected)
- `GET /api/short_url/:id/stats` (protected)

Analytics:

- `GET /api/analytics/dashboard` (protected)

User:

- `POST /api/users/urls` (protected)

Health:

- `GET /api/health`

Redirect:

- `GET /:id`

## Deployment

### Vercel

Recommended setup is two Vercel projects:

1. Frontend project
- Root Directory: `FRONTEND`
- Build command: `npm run build`
- Output directory: `dist`
- Uses `FRONTEND/vercel.json` (SPA rewrite)

2. Backend project
- Root Directory: `BACKEND`
- Uses `BACKEND/vercel.json` + `BACKEND/api/index.js`

If you deploy frontend from repo root, this repo also includes root `vercel.json` for that case.

### Render

Use two services:

1. Backend Web Service
- Root Directory: `BACKEND`
- Build Command: `npm install`
- Start Command: `node app.js`
- Health Check Path: `/api/health`

2. Frontend Static Site
- Root Directory: `FRONTEND`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Rewrite rule: `/* -> /index.html`

## Troubleshooting

- `404 NOT_FOUND` on Vercel root domain: Ensure project root is correct (`FRONTEND` for frontend project), or use root `vercel.json`.
- Signup/Login fails on deployed env: Check frontend `VITE_API_URL`, backend CORS origin (`FRONTEND_URL`/`FRONTEND_URLS`), and production cookie settings.
- `503 Database is unavailable`: Check MongoDB URI and Atlas network access.

## Useful Links

- Live App: https://snapurl-url-shortner.vercel.app/
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/atlas

## License

This project is licensed under the MIT License.
