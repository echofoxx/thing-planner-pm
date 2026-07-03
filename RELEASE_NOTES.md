# Thing Planner PM v0.3.3 Release Notes

## Purpose

v0.3.3 is a Docker reliability patch for the modern React/Vite frontend.

## Fixes

- Changed the default Docker build to serve the already-built `dist/` folder with Nginx.
- Avoids `npm install` during the normal Docker build path.
- Keeps a separate `Dockerfile.build` for source-based production builds when desired.
- Retains the v0.3.2 UX fixes: closable drill-down drawer, theme selector, improved layout polish, and TypeScript module-resolution fix.

## Recommended Docker command

```powershell
cd C:\docker\thing-planner-pm
docker compose down
docker compose build --no-cache
docker compose up -d
```

Open:

```text
http://localhost:8088
```

## Source-build option

If you want Docker to rebuild the React app from source instead of using the committed `dist/` folder:

```powershell
docker build -f Dockerfile.build -t thing-planner-pm:source-build .
```
