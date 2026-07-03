# Thing Planner PM v0.3.4 Release Notes

## Purpose

v0.3.4 adds a higher-quality AI/work-management UX inspired by modern project platforms and CRM-style workflows.

## Added

- AI Command Center
- AI sidekick action suggestions
- Predictive Project End dashboard
- Budget, pace, capacity, and time-slippage signals
- Resource capacity heatmap
- CRM Work Pipeline
- Accounts, contacts, workstreams, estimated value, stage, owner, health, and next action fields
- Portfolio hero panel with enterprise visibility messaging
- Team planning table experience with Main table / Forecast / Kanban / AI tabs
- More polished light-first UI with existing theme support
- AI drawer with plan actions
- Smarter task drill-down recommendations

## Fixed / Retained

- Retains v0.3.3 Docker reliability patch using prebuilt `dist/`
- Retains v0.3.2 drawer close behavior fix
- Retains theme selector
- Retains TypeScript module-resolution fix
- Maintains Docker and local Node run paths

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
