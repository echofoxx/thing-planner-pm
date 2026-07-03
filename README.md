# Thing Planner PM v0.3.4

**AI-driven project management for every team with enterprise-grade visibility.**

Thing Planner PM is a modern, template-first project management web app for software, home, auto, office, standards/document, event, and mixed workstream projects. It combines a clean project command center, Kanban, WBS, project relationships, forecasting, capacity planning, CRM-style work tracking, and AI sidekick concepts in one approachable Project OS.

v0.3.4 is a frontend/demo-data release built with **React + Vite + TypeScript**. It is Docker-ready and includes a prebuilt `dist/` folder so Docker can serve the app without running `npm install` inside the container.

## Release Goal

v0.3.4 upgrades the app from a project board prototype into a more enterprise-style work management experience inspired by modern planning platforms:

- AI action suggestions
- Team planning table experience
- Predictive project end dashboard
- Budget, pace, capacity, and time-slippage signals
- Resource capacity heatmap
- CRM-style accounts/contact/workstream pipeline
- Theme selector and cleaner executive UI
- Drill-down project references and smart task context

## Key Features

### AI Command Center

- AI sidekick-style action suggestions
- Timeline adjustment prompts
- Team overload warnings
- Status summary and task assignment suggestions
- Scope clarifier, risk prompts, and next-action guidance

### Portfolio Command Center

- Enterprise visibility across accessible projects
- Active project count
- At-risk projects
- Blocked tasks
- Review workload
- Project health cards
- Progress bars
- AI recommendations

### Project Board

- Kanban workflow with drag-and-drop columns
- Task cards with WBS, priority, phase, milestone, owner, and due date
- Search/filter across task details, owner, phase, milestone, WBS, and status
- Smart task references retained across views

### Predictive Delivery Center

- Predicted project end concept
- Simulated time slippage
- Budget impact signal
- Project pace signal
- Team capacity signal
- Forecast chart and executive project detail rows

### Resource Capacity Planner

- Team member availability table
- Resource match scores
- Monthly capacity heatmap
- Full, available, and overallocated states
- Assignment buttons for future backend integration

### CRM Work Pipeline

- Account and contact tracking
- Workstream/project linkage
- Stage, value, owner, health, and next action fields
- CRM-style automations concept
- Connected attributes: account → project → milestone → task

### WBS and Traceability

- Work Breakdown Structure table
- Project → phase → milestone → task relationship model
- Owner/status visibility
- Risk, issue, and dependency counts
- Task drill-down with acceptance criteria and evidence

### Relationship Map

- Project relationship visualization
- Phase drill-downs
- Milestone context
- Task-level relationships and ownership

### Admin Console Concept

- User list
- Role visibility
- Project access count
- Repair tools concept
- Rebuild WBS numbering
- Recalculate project health
- Validate imported data
- Restore archived project

### Themes

Included themes:

- Light Workspace
- Executive Blue
- Slate Professional
- Midnight Command

## User Roles

| Role | Purpose |
|---|---|
| Admin | Full workspace visibility, admin tools, all projects |
| Power User | Multiple projects and portfolio management |
| Member | Task execution and collaboration |
| Viewer | Read-only dashboard/report visibility |

## Installation

### Run with Docker

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

### Run locally with Node

```powershell
cd C:\docker\thing-planner-pm
npm install
npm run dev
```

Open:

```text
http://localhost:8088
```

### Build locally

```powershell
npm run build
```

## Docker Notes

The default `Dockerfile` serves the prebuilt `dist/` folder with Nginx. This avoids npm install problems inside Docker.

For source-based Docker builds, use:

```powershell
docker build -f Dockerfile.build -t thing-planner-pm:source-build .
```

## GitHub Commit

```powershell
cd C:\docker\thing-planner-pm
git add .
git commit -m "Add AI command CRM forecast and resource planning UX"
git push -u origin main
```

## Roadmap

### v0.4.0 — Backend Foundation

- FastAPI or Node backend
- SQLite local database
- Real users/authentication
- Persistent project data
- Project memberships and permissions
- Activity/audit log
- API routes for projects, tasks, users, roles, comments, and reports

### v0.5.0 — Collaboration

- Comments
- Mentions
- Notifications
- Task assignments
- Activity stream
- Project sharing
- Admin project repair actions connected to backend

### v0.6.0 — Real AI Integration

- Local Ollama option
- Project starter assistant
- AI WBS generator
- Risk finder
- Status report writer
- Similar completed project recall
- Closeout/lessons learned assistant

### v0.7.0 — Templates and Reuse

- Template manager
- Clone completed project as template
- Team templates
- Project-type starter libraries
- Lessons learned library

### v1.0.0 — Production Release

- Real auth
- Backend persistence
- Admin console
- Multi-user collaboration
- Import/export validation
- PDF/CSV/JSON reports
- Backup/restore
- Production Docker Compose
- Screenshots and demo data

## Current Limitations

- v0.3.4 is still frontend/demo-data driven.
- CRM, AI, resource planning, forecasting, and admin controls are frontend-ready concepts.
- v0.4.0 should connect the UI to a real backend and persistence layer.
