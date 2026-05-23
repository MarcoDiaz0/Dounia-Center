# Dounia-Center

## Local development

### Backend

From the project root:

```bash
npm install
npm run dev
```

### Frontend

From the project root:

```bash
npm --prefix client install
npm --prefix client run dev
```

## Vercel deployment

This repository is configured to deploy as:

- a static Vite frontend from `client/dist`
- serverless API routes from `api/*.js`
- a shared Express app loaded from `server/app.js`

### Required environment variables

Set these in your Vercel project settings:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (optional, defaults to `7d`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV=production`

### Important deployment notes

- Frontend API calls use `/api` in production, which matches the Vercel routing setup.
- Resource uploads are configured for **direct browser upload to Cloudinary** using a server-generated signature. This avoids passing large files through Vercel functions.
- Authentication uses an HTTP-only cookie named `dounia-token`.

### Build settings

The repository already includes `vercel.json`, so Vercel can use the repo root as the project root.

If you need the equivalent settings manually:

- **Build Command:** `npm --prefix client install && npm --prefix client run build`
- **Output Directory:** `client/dist`

## Validation run

The following checks were run successfully:

- `npm run build`
- `node -e "import('./api/index.js').then(() => console.log('api import ok')).catch((error) => { console.error(error); process.exit(1); })"`

## Remaining recommendation

The frontend production bundle currently emits a large chunk warning during build. This does **not** block deployment, but code-splitting would improve load performance later.
