# Backend Plan for Thing Planner PM

## Recommended Stack

- Frontend: React + Vite + TypeScript
- Backend: FastAPI or Node/Express
- Database: SQLite for local-first MVP, Postgres for production
- Auth: Local auth first, OAuth/Keycloak later
- Deployment: Docker Compose

## Core Tables

- users
- roles
- projects
- project_members
- phases
- milestones
- tasks
- subtasks
- risks
- issues
- decisions
- lessons
- comments
- activity_log
- templates
- exports

## Initial API Routes

```text
POST   /api/auth/login
GET    /api/me
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PATCH  /api/projects/{id}
DELETE /api/projects/{id}
GET    /api/projects/{id}/tasks
POST   /api/projects/{id}/tasks
PATCH  /api/tasks/{id}
GET    /api/projects/{id}/activity
POST   /api/projects/{id}/export
POST   /api/projects/import
GET    /api/admin/users
PATCH  /api/admin/users/{id}
POST   /api/admin/projects/{id}/repair
```

## Priority Rules

- Enforce project membership on every project API call.
- Admin can access all projects.
- Power User can create and manage own projects.
- Member can update assigned tasks and comment.
- Viewer is read-only.
- All write actions generate activity_log records.
