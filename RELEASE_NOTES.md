# Thing Planner PM v0.3.1 Release Notes

## Fixes

- Fixed Docker production build failure caused by TypeScript deprecation enforcement around `moduleResolution=node10`.
- Updated `tsconfig.json` to use `moduleResolution: Bundler`, which is appropriate for Vite-based apps.
- Pinned TypeScript to the 5.x line so Docker builds are more reproducible.

# Release Notes — Thing Planner PM v0.3.0

## Summary

v0.3.0 rebuilds Thing Planner PM as a modern React/Vite/TypeScript frontend foundation. It introduces a professional application shell, multi-user role model, multi-project portfolio, project-level dashboards, WBS traceability, relationship drill-downs, task drawers, and admin console concepts.

## Added

- React + Vite + TypeScript project structure
- Dockerfile and docker-compose.yml
- Role switcher for Admin, Power User, Member, Viewer
- Multiple projects per user demo model
- Portfolio Command Center
- Project Kanban board
- WBS table
- Relationship map
- Task drill-down drawer
- Phase drill-down drawer
- Admin console concept
- Executive report page
- Backend-ready data types and selectors

## Known Limitations

- Data is demo/static frontend data.
- Auth is simulated through a user switcher.
- Admin actions are frontend placeholders.
- Kanban drag/drop state should be hardened in v0.3.1.
- Import/export from earlier static version should be reintroduced in React form.

## Recommended Next Release

v0.4.0 should add a real backend, SQLite persistence, real authentication, project memberships, role-based API enforcement, and activity logging.
