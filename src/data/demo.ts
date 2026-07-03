import type { ActivityEvent, Milestone, Phase, Project, RiskIssue, Task, User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Adrian Francis', email: 'echofoxx@gmail.com', role: 'Admin', avatar: 'AF' },
  { id: 'u2', name: 'Morgan Lee', email: 'morgan@example.com', role: 'Power User', avatar: 'ML' },
  { id: 'u3', name: 'Jamie Rivera', email: 'jamie@example.com', role: 'Member', avatar: 'JR' },
  { id: 'u4', name: 'Taylor Kim', email: 'taylor@example.com', role: 'Viewer', avatar: 'TK' }
];

export const phases: Phase[] = [
  { id: 'ph1', projectId: 'p1', name: 'Discovery & Scope', status: 'Done', progress: 100, milestoneIds: ['m1'], description: 'Confirm product goal, users, constraints, and success criteria.' },
  { id: 'ph2', projectId: 'p1', name: 'UX / Data Model', status: 'In Progress', progress: 65, milestoneIds: ['m2'], description: 'Design project relationships, dashboards, workflow, and traceability model.' },
  { id: 'ph3', projectId: 'p1', name: 'Build & Release', status: 'Ready', progress: 20, milestoneIds: ['m3'], description: 'Implement MVP features, package for Docker, and publish to GitHub.' },
  { id: 'ph4', projectId: 'p2', name: 'Plan Repair', status: 'In Progress', progress: 55, milestoneIds: ['m4'], description: 'Diagnose vehicle issue, identify parts, estimate timeline, and confirm tools.' },
  { id: 'ph5', projectId: 'p3', name: 'Home Scope', status: 'Review', progress: 80, milestoneIds: ['m5'], description: 'Define home project scope, budget, materials, and completion criteria.' }
];

export const milestones: Milestone[] = [
  { id: 'm1', projectId: 'p1', phaseId: 'ph1', name: 'Project charter approved', dueDate: '2026-07-06', status: 'Done', taskIds: ['t1', 't2'] },
  { id: 'm2', projectId: 'p1', phaseId: 'ph2', name: 'Modern frontend prototype', dueDate: '2026-07-12', status: 'In Progress', taskIds: ['t3', 't4', 't5'] },
  { id: 'm3', projectId: 'p1', phaseId: 'ph3', name: 'v0.3.0 GitHub release', dueDate: '2026-07-18', status: 'Ready', taskIds: ['t6'] },
  { id: 'm4', projectId: 'p2', phaseId: 'ph4', name: 'Parts and tools ready', dueDate: '2026-07-10', status: 'In Progress', taskIds: ['t7', 't8'] },
  { id: 'm5', projectId: 'p3', phaseId: 'ph5', name: 'Materials selected', dueDate: '2026-07-14', status: 'Review', taskIds: ['t9'] }
];

export const risks: RiskIssue[] = [
  { id: 'r1', projectId: 'p1', title: 'Scope expands before backend foundation is stable', severity: 'High', status: 'Mitigating', linkedTaskIds: ['t4', 't6'] },
  { id: 'r2', projectId: 'p2', title: 'Part compatibility uncertainty', severity: 'Medium', status: 'Open', linkedTaskIds: ['t7'] }
];

export const issues: RiskIssue[] = [
  { id: 'i1', projectId: 'p1', title: 'Need persistence strategy before real multi-user collaboration', severity: 'High', status: 'Open', linkedTaskIds: ['t6'] },
  { id: 'i2', projectId: 'p3', title: 'Budget range needs confirmation', severity: 'Medium', status: 'Open', linkedTaskIds: ['t9'] }
];

export const tasks: Task[] = [
  { id: 't1', projectId: 'p1', phaseId: 'ph1', milestoneId: 'm1', wbs: '1.1', title: 'Define v0.3.0 product scope', description: 'Lock the scope around modern frontend, project ownership, dashboards, and admin-ready data model.', ownerId: 'u1', status: 'Done', priority: 'High', dueDate: '2026-07-05', dependencyIds: [], riskIds: [], issueIds: [], acceptanceCriteria: ['Scope lists included features', 'Deferred backend items captured'], evidence: ['README roadmap updated'] },
  { id: 't2', projectId: 'p1', phaseId: 'ph1', milestoneId: 'm1', wbs: '1.2', title: 'Map spreadsheet lifecycle to app modules', description: 'Trace spreadsheet sections to onboarding, WBS, monitoring, issue log, and reporting modules.', ownerId: 'u1', status: 'Done', priority: 'Medium', dueDate: '2026-07-06', dependencyIds: ['t1'], riskIds: [], issueIds: [], acceptanceCriteria: ['Lifecycle sections have app equivalents'], evidence: [] },
  { id: 't3', projectId: 'p1', phaseId: 'ph2', milestoneId: 'm2', wbs: '2.1', title: 'Build role-based shell', description: 'Create modern application shell with user switcher, role badges, sidebar, and project selector.', ownerId: 'u2', status: 'In Progress', priority: 'High', dueDate: '2026-07-08', dependencyIds: ['t1'], riskIds: [], issueIds: [], acceptanceCriteria: ['Admin, Power User, Member, Viewer visible', 'Navigation adapts by role'], evidence: [] },
  { id: 't4', projectId: 'p1', phaseId: 'ph2', milestoneId: 'm2', wbs: '2.2', title: 'Create project relationship drill-downs', description: 'Connect tasks to phases, milestones, owners, risks, issues, dependencies, and acceptance criteria.', ownerId: 'u1', status: 'Review', priority: 'Critical', dueDate: '2026-07-10', dependencyIds: ['t3'], riskIds: ['r1'], issueIds: [], acceptanceCriteria: ['Task drawer shows references', 'Relationship map shows project objects'], evidence: [] },
  { id: 't5', projectId: 'p1', phaseId: 'ph2', milestoneId: 'm2', wbs: '2.3', title: 'Improve portfolio dashboard UX', description: 'Show collective project health, user workload, blockers, milestones, and recent activity.', ownerId: 'u2', status: 'Ready', priority: 'High', dueDate: '2026-07-11', dependencyIds: ['t3'], riskIds: [], issueIds: [], acceptanceCriteria: ['Clickable metrics filter data', 'Cards show clear status'], evidence: [] },
  { id: 't6', projectId: 'p1', phaseId: 'ph3', milestoneId: 'm3', wbs: '3.1', title: 'Prepare backend foundation plan', description: 'Define SQLite/Postgres schema, auth flow, API boundaries, and migration from local storage.', ownerId: 'u1', status: 'Blocked', priority: 'High', dueDate: '2026-07-15', dependencyIds: ['t4'], riskIds: ['r1'], issueIds: ['i1'], acceptanceCriteria: ['Schema proposal complete', 'API route list complete'], evidence: [] },
  { id: 't7', projectId: 'p2', phaseId: 'ph4', milestoneId: 'm4', wbs: '1.1', title: 'Confirm parts list', description: 'Validate part numbers, compatibility, cost, and delivery window.', ownerId: 'u1', status: 'In Progress', priority: 'High', dueDate: '2026-07-09', dependencyIds: [], riskIds: ['r2'], issueIds: [], acceptanceCriteria: ['Parts list approved', 'Compatibility confirmed'], evidence: [] },
  { id: 't8', projectId: 'p2', phaseId: 'ph4', milestoneId: 'm4', wbs: '1.2', title: 'Prepare tools and workspace', description: 'Confirm jack stands, torque wrench, lighting, safety gear, and workspace.', ownerId: 'u3', status: 'Ready', priority: 'Medium', dueDate: '2026-07-10', dependencyIds: ['t7'], riskIds: [], issueIds: [], acceptanceCriteria: ['Workspace cleared', 'Tools staged'], evidence: [] },
  { id: 't9', projectId: 'p3', phaseId: 'ph5', milestoneId: 'm5', wbs: '1.1', title: 'Select countertop finish approach', description: 'Compare sanding, stripping, stain, sealer, and food-safe finish options.', ownerId: 'u1', status: 'Review', priority: 'Medium', dueDate: '2026-07-14', dependencyIds: [], riskIds: [], issueIds: ['i2'], acceptanceCriteria: ['Approach selected', 'Material list created'], evidence: [] }
];

export const projects: Project[] = [
  { id: 'p1', name: 'Thing Planner PM v0.3.0', type: 'Software', ownerId: 'u1', memberIds: ['u1', 'u2', 'u3', 'u4'], health: 'Yellow', status: 'Active', goal: 'Turn the prototype into a modern multi-user frontend foundation with traceability and drill-downs.', startDate: '2026-07-03', targetDate: '2026-07-18', phaseIds: ['ph1', 'ph2', 'ph3'], milestoneIds: ['m1', 'm2', 'm3'], taskIds: ['t1','t2','t3','t4','t5','t6'], riskIds: ['r1'], issueIds: ['i1'], lessons: ['Keep task data unified across Kanban, WBS, and dashboard.'] },
  { id: 'p2', name: 'BMW Repair Planner', type: 'Auto', ownerId: 'u1', memberIds: ['u1', 'u3'], health: 'Green', status: 'Active', goal: 'Plan a vehicle repair with parts, tools, risk, and completion evidence.', startDate: '2026-07-01', targetDate: '2026-07-16', phaseIds: ['ph4'], milestoneIds: ['m4'], taskIds: ['t7','t8'], riskIds: ['r2'], issueIds: [], lessons: [] },
  { id: 'p3', name: 'Kitchen Island Refinish', type: 'Home', ownerId: 'u1', memberIds: ['u1'], health: 'Yellow', status: 'Active', goal: 'Refinish island top with safe materials and documented steps.', startDate: '2026-06-30', targetDate: '2026-07-20', phaseIds: ['ph5'], milestoneIds: ['m5'], taskIds: ['t9'], riskIds: [], issueIds: ['i2'], lessons: [] }
];

export const activity: ActivityEvent[] = [
  { id: 'a1', projectId: 'p1', actorId: 'u1', message: 'Created v0.3.0 roadmap and modern frontend scope.', timestamp: '2026-07-03T12:00:00Z' },
  { id: 'a2', projectId: 'p1', actorId: 'u2', message: 'Moved role-based shell to In Progress.', timestamp: '2026-07-03T13:30:00Z' },
  { id: 'a3', projectId: 'p1', actorId: 'u1', message: 'Opened backend persistence issue for v0.4 planning.', timestamp: '2026-07-03T14:10:00Z' }
];
