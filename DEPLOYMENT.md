# Deployment Guide

Target setup:

Users -> Netlify React website -> Render FastAPI API -> PostgreSQL database

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

## 3. After Deploying

Open the Render API URL first and confirm it returns:

```json
{"message":"Church Management API Running"}
```

Then open the Netlify site and log in with the first bishop credentials you set on Render.

## Note About Uploads

Render web service disks are temporary unless you attach persistent storage. Uploaded images and videos should use Render persistent disk or an external storage service before heavy production use.
