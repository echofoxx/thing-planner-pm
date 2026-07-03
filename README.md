# Thing Planner PM

A lightweight, template-first project management web application inspired by a legacy Excel lifecycle planning workbook. It is designed to be simple enough for personal projects, flexible enough for professional work, and structured enough to support traceability, workflow, WBS planning, reporting, and reuse of completed projects.

## What it does

Thing Planner PM helps users start and manage different kinds of projects without building a plan from scratch every time.

The app asks for a project type, then pre-populates:

- Project phases
- Milestones
- Minimum starter tasks
- Risks
- Team roles
- Workflow steps
- Status report structure

Supported starter templates in v0.1.0:

- Software Application
- Home Project
- Auto Project
- Office / Work Project
- Document / Standards Project
- Event

## Core features

- Project Command Center dashboard
- New Project Wizard
- Template-driven starter plans
- Kanban board with drag-and-drop workflow
- Work Breakdown Structure task planner
- Lightweight timeline / Gantt-style view
- Risks, issues, decisions, lessons learned, and activity log
- Local browser persistence using `localStorage`
- JSON export/import for offline continuation and backup
- CSV task export for spreadsheet review
- Completed project archive
- Reuse completed projects as future templates
- Rule-based AI-style next action assistant

## Why this exists

This app modernizes the flow from the attached `Lifecycle_Project_Plan_v1_25.xlsx` workbook. The workbook included:

- Introduction / instructions
- Basic project data entry
- Planning and WBS task setup
- Task monitoring with Gantt-style reporting
- Issue log
- Reporting
- Hidden calculation sheets

Thing Planner PM turns that structure into an interactive browser-based tool.

## Quick start

No build step is required.

```bash
cd thing-planner-pm
python3 -m http.server 8088
```

Then open:

```text
http://localhost:8088
```

On Windows PowerShell:

```powershell
cd C:\docker\thing-planner-pm
py -m http.server 8088
```

## Add to GitHub

Create a new repository under your GitHub account, for example:

```text
https://github.com/echofoxx/thing-planner-pm
```

Then run:

```bash
cd thing-planner-pm
git init
git add .
git commit -m "Initial Thing Planner PM prototype"
git branch -M main
git remote add origin https://github.com/echofoxx/thing-planner-pm.git
git push -u origin main
```

If you already created the repo and cloned it locally:

```bash
cp -R thing-planner-pm/* /path/to/your/cloned/repo/
cd /path/to/your/cloned/repo
git add .
git commit -m "Add Thing Planner PM prototype"
git push
```

## Recommended repo description

> Template-first project management web app with Kanban, WBS, workflow traceability, project templates, reporting, and offline JSON/CSV import-export.

## Recommended GitHub topics

```text
project-management, kanban, wbs, planning, offline-first, productivity, javascript, template-driven, ai-planning
```

## Data model overview

The app uses one shared project data model across all views.

```text
Project
 ├── Team Members
 ├── Phases
 ├── Tasks
 │    ├── WBS ID
 │    ├── Status
 │    ├── Owner
 │    ├── Dates
 │    ├── Priority
 │    ├── Evidence
 │    └── Comments
 ├── Risks
 ├── Issues
 ├── Decisions
 ├── Lessons Learned
 └── Activity Log
```

When a task changes status, all views use the same underlying data. For example, dragging a card to `Done` updates task status, actual finish date, progress, dashboard metrics, reports, and the activity log.

## Workflow states

Default workflow:

```text
Backlog → Ready → In Progress → Review → Blocked → Done
```

The workflow is intentionally simple in v0.1.0. Future versions should support custom workflows by project type.

## AI roadmap

v0.1.0 includes a local rule-based assistant that recommends next actions from project data.

Future AI capabilities:

- AI project scoping interview
- AI-generated WBS from rough notes
- Similar project recall from completed archives
- AI risk detection
- AI weekly status report writer
- AI closeout and lessons learned assistant
- Optional Ollama support for local AI
- Optional hosted API support

## Roadmap

### v0.2.0 - Project usability

- Editable project metadata
- Custom templates
- Better CSV import
- Better Kanban card filtering
- Task dependencies
- Budget fields
- Attachment placeholders

### v0.3.0 - Professional planning

- Real Gantt dependency lines
- Baseline vs actual dates
- Milestone health scoring
- Project calendar
- Advanced reporting
- Markdown export package

### v0.4.0 - Multi-user foundation

- Backend API
- SQLite/Postgres persistence
- User accounts
- Project roles
- Comments and mentions
- Audit history

### v1.0.0 - Production release

- Docker Compose deployment
- Authentication
- Database migrations
- Multi-user collaboration
- AI provider configuration
- Completed project knowledge base
- Admin template manager
- PDF report export

## Design principles

- Simple by default, detailed on demand
- One shared data model across all views
- Template-first project creation
- Offline-friendly import/export
- Professional traceability without Jira-level friction
- Reuse completed projects to improve future planning

## License

MIT
