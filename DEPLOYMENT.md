# Deployment Guide

Target setup:

Users -> Netlify React website -> Render FastAPI API -> PostgreSQL database

## Railway FastAPI API

This repository contains both the React frontend and the FastAPI backend. Configure
the Railway **backend service** with these settings so it deploys `Backend`, rather
than detecting the root frontend `package.json` as a Node.js application:

- Root Directory: `Backend`
- Config File Path: `/Backend/railway.toml`

`Backend/railway.toml` uses Railpack and defines:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

`Backend/mise.toml` pins Railway's Python runtime to `3.11.11` and disables
Mise's Python GitHub artifact-attestation lookup. `runtime.txt` contains the
same version as a fallback for Python build detection.

Set these Railway variables before deploying:

- `DATABASE_URL`: Railway PostgreSQL connection string (recommended for production)
- `FRONTEND_ORIGINS`: optional comma-separated additional frontend origins; `https://lifeline-grace-church.vercel.app`, `https://lifelinegrace.co.ke`, `https://www.lifelinegrace.co.ke`, `http://localhost:5173`, and `http://127.0.0.1:5173` are already allowed
- `DEFAULT_BISHOP_USERNAME`, `DEFAULT_BISHOP_PASSWORD`, `DEFAULT_BISHOP_FULL_NAME`, and `DEFAULT_BISHOP_PHONE`: initial administrator details

Generate a public Railway domain for the service after it deploys. The healthcheck
uses `/`, which returns the API status response.

## 1. Render API and PostgreSQL

Create a Render Blueprint from this repository using `render.yaml`, or create them manually:

- Web service build command: `pip install -r Backend/requirements.txt`
- Web service start command: `cd Backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- PostgreSQL database: attach its connection string as `DATABASE_URL`

Set these Render environment variables:

- `DATABASE_URL`: Render PostgreSQL internal connection string
- `FRONTEND_ORIGINS`: your Netlify URL, for example `https://your-site.netlify.app`
- `DEFAULT_BISHOP_USERNAME`: first bishop username, only used if the bishops table is empty
- `DEFAULT_BISHOP_PASSWORD`: first bishop password, only used if the bishops table is empty
- `DEFAULT_BISHOP_FULL_NAME`: optional display name
- `DEFAULT_BISHOP_PHONE`: optional phone

The backend creates required tables on startup for a fresh PostgreSQL database.

## 2. Netlify React Website

Create a Netlify site from this repository.

Use:

- Build command: `npm run build`
- Publish directory: `dist`

Set this Netlify environment variable:

- `VITE_API_URL`: your Render API URL, for example `https://your-render-api.onrender.com`

`netlify.toml` already includes the build settings and SPA redirect.

## Vercel Frontend

For a Vercel deployment, set `VITE_API_URL` in the Vercel project environment
variables to the public Railway backend URL, for example
`https://your-service.up.railway.app` (without a trailing slash). Add it to the
Production environment, then redeploy Vercel so Vite includes the value in the
frontend build. Every frontend API request uses this value.

## 3. After Deploying

Open the Render API URL first and confirm it returns:

```json
{"message":"Church Management API Running"}
```

Then open the Netlify site and log in with the first bishop credentials you set on Render.

## Note About Uploads

Render web service disks are temporary unless you attach persistent storage. Uploaded images and videos should use Render persistent disk or an external storage service before heavy production use.
