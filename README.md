# Thing Planner PM v0.3.0

A modern, template-first project management web application for software, home, auto, office, standards/document, and event projects. This release moves Thing Planner PM from a static prototype toward a real modern frontend foundation using React, Vite, and TypeScript.

## Release Goal

v0.3.0 introduces a modern frontend architecture with a polished UI, multi-user role model, multiple projects per user, project portfolio dashboard, drill-downs, smart references, WBS traceability, admin console concepts, and Docker-ready deployment.

This version is still frontend/demo-data driven, but the data model is shaped for a future backend using SQLite/Postgres and real authentication.

## Features

### Modern Frontend

- React + Vite + TypeScript
- Componentized application shell
- Responsive layout for desktop and tablet
- Professional dark command-center visual style
- Sidebar navigation, top action bar, project switcher, and detail drawer

### Multi-User Foundation

Demo roles are included:

| Role | Purpose |
|---|---|
| Admin | Full workspace visibility and admin console access |
| Power User | Multiple projects and portfolio management |
| Member | Task execution and project collaboration |
| Viewer | Read-only dashboard and report access |

The demo user switcher allows quick role testing.

### Multiple Projects Per User

- User-visible project list
- Project ownership model
- Project membership model
- Portfolio view across accessible projects
- Per-project dashboard, WBS, relationship, and reporting views

### Portfolio Command Center

- Active projects
- Blocked tasks
- Review workload
- Admin readiness
- Project health cards
- Progress bars
- AI project coach panel
- Recent activity feed

### Project Board

- Kanban workflow columns
- Task cards with WBS, priority, phase, milestone, owner, and due date
- Search/filter field
- Smart references retained across project views

### WBS View

- Work Breakdown Structure table
- Phase/milestone/task traceability
- Owner and status visibility
- Risk, issue, and dependency counts
- Clickable task drill-down

### Relationship Map

- Project → Phase → Milestone → Task visual flow
- Clickable phase drill-down
- Clickable task drill-down
- Helps users understand how work items relate to project outcomes

### Task Drill-Down Drawer

Each task includes:

- WBS ID
- Description
- Phase reference
- Milestone reference
- Owner reference
- Dependencies
- Risks
- Issues
- Acceptance criteria
- Evidence placeholder

### Admin Console Concept

Admin tools include frontend-ready controls for:

- User visibility
- Project visibility
- Recalculate project health
- Rebuild WBS numbering
- Validate imported data
- Restore archived projects
- Audit-mode concept

### Reports

- Executive status summary
- Project traceability summary
- Export action placeholders
- Markdown/status report direction

## Installation

### Prerequisites

- Node.js 22 or later recommended
- npm
- Docker Desktop optional

## Run Locally Without Docker

```powershell
cd C:\docker\thing-planner-pm
npm install
npm run dev
```

Open:

```text
http://localhost:8088
```

## Run With Docker

```powershell
cd C:\docker\thing-planner-pm
docker compose up --build -d
```

Open:

```text
http://localhost:8088
```

Stop:

```powershell
docker compose down
```

## Build for Production

```powershell
npm install
npm run build
npm run preview
```

## GitHub Update Workflow

From your local project folder:

```powershell
cd C:\docker\thing-planner-pm
git status
git add .
git commit -m "Upgrade to modern React frontend v0.3.0"
git push -u origin main
```

If GitHub has remote changes, pull first:

```powershell
git pull origin main --allow-unrelated-histories
```

Resolve conflicts, then commit and push.

## User Guide

### 1. Select a User Role

Use the user selector in the sidebar to test the app as:

- Adrian Francis / Admin
- Morgan Lee / Power User
- Jamie Rivera / Member
- Taylor Kim / Viewer

### 2. Open Portfolio

The Portfolio Command Center shows all projects visible to the current user. Click a project card to drill into that project.

### 3. Use Project Board

The board displays project tasks by workflow status. Cards include project references such as phase, milestone, owner, due date, and priority.

### 4. Open a Task Drill-Down

Click any task card or WBS row to open the task drawer. The drawer shows the task's smart project references.

### 5. Use WBS View

The WBS table shows project structure and traceability from work package to status, owner, milestone, and related risks/issues.

### 6. Use Relationship View

The relationship view shows how the project connects phases, milestones, and tasks. This is intended to evolve into a full relationship graph.

### 7. Use Admin Console

Switch to the Admin role to see the Admin Console. Admin tools are currently frontend placeholders and should be connected to backend API actions in the next release.

## Data Model Direction

v0.3.0 uses demo data, but the structure is intentionally backend-ready:

```text
User
 └── Project Membership
      └── Project
           ├── Phases
           ├── Milestones
           ├── Tasks
           ├── Risks
           ├── Issues
           ├── Decisions
           ├── Lessons Learned
           ├── Activity Events
           └── Reports
```

## Roadmap

### v0.3.1 — UX hardening

- Make Kanban drag/drop fully persistent in frontend state
- Add saved filters
- Add clickable dashboard metric filters
- Add mobile refinements
- Add more sample project templates
- Add import/export back into the React app

### v0.4.0 — Backend foundation

- FastAPI or Node API
- SQLite database
- Real authentication
- User accounts
- Project memberships
- Role-based access checks
- Persistent projects/tasks/risks/issues
- Activity log table
- Docker Compose app + API + DB

### v0.5.0 — Collaboration and Admin

- Comments
- Mentions
- Notifications
- Admin repair actions
- Transfer project ownership
- Archive/restore projects
- Project-level permissions
- Audit log UI

### v0.6.0 — AI Project Assistant

- Project starter wizard
- WBS generator
- Risk finder
- Status report writer
- Closeout assistant
- Similar project recall
- Template recommendations

### v0.7.0 — Templates and knowledge reuse

- Template manager
- User/team/system templates
- Clone completed project as template
- Lessons learned library
- Actual duration vs estimate
- Reusable checklists

### v0.8.0 — Attachments and evidence

- File upload support
- Photos/screenshots
- Links and references
- Completion evidence
- Receipt/document metadata
- Attachment storage layer

### v1.0.0 — Production Release

- Real backend
- Multi-user accounts
- Multi-project dashboards
- Admin console
- Role-based permissions
- Kanban/WBS/timeline/reporting
- AI planning assistant
- Import/export
- Backup/restore
- Docker deployment
- Production documentation

## Screenshots

Add screenshots to:

```text
public/screenshots/
```

Suggested files:

```text
portfolio-dashboard.png
project-board.png
wbs-view.png
relationship-map.png
task-drawer.png
admin-console.png
```

Then reference them in this README:

```markdown
![Portfolio Dashboard](public/screenshots/portfolio-dashboard.png)
```

## Notes

This version is intended as a modern frontend foundation. The next critical step is backend persistence with real authentication and role-based project access.


## Docker build troubleshooting

If Docker fails during `npm run build` with a TypeScript `moduleResolution=node10` deprecation warning, make sure `tsconfig.json` uses:

```json
"moduleResolution": "Bundler"
```

Then rebuild without cache:

```powershell
docker compose down
docker compose build --no-cache
docker compose up -d
```

This release pins TypeScript to the 5.x line and uses the Vite-recommended bundler module resolution setting.
