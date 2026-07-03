import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, Archive, Bot, Boxes, CalendarClock, CheckCircle2, ChevronRight, ClipboardList, Database, Download, GitBranch, KanbanSquare, Layers3, LayoutDashboard, LockKeyhole, Search, Settings, Shield, Sparkles, UserCog, Users, Wrench, X } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { projects, users, tasks as demoTasks, phases, milestones, risks, issues } from './data/demo';
import type { Project, Status, Task, User } from './types';
import { calculateProgress, issueById, milestoneById, phaseById, projectActivity, projectStats, riskById, statuses, userById, visibleProjects } from './lib/selectors';
import './styles.css';

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function MetricCard({ label, value, helper, icon, onClick }: { label: string; value: string | number; helper: string; icon: React.ReactNode; onClick?: () => void }) {
  return <button className="metric-card" onClick={onClick}>
    <div className="metric-icon">{icon}</div>
    <div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <p>{helper}</p>
    </div>
  </button>;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [activeView, setActiveView] = useState('portfolio');
  const [taskList, setTaskList] = useState<Task[]>(demoTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(demoTasks[3]);
  const [drawerMode, setDrawerMode] = useState<'task' | 'phase' | 'admin'>('task');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('ph2');
  const [query, setQuery] = useState('');

  const accessibleProjects = useMemo(() => visibleProjects(currentUser), [currentUser]);
  const selectedProject = accessibleProjects.find((project) => project.id === selectedProjectId) ?? accessibleProjects[0];
  const projectTasks = taskList.filter((task) => task.projectId === selectedProject?.id);
  const filteredTasks = projectTasks.filter((task) => [task.title, task.description, task.wbs, task.status, userById(task.ownerId).name].join(' ').toLowerCase().includes(query.toLowerCase()));

  function selectProject(project: Project) {
    setSelectedProjectId(project.id);
    setActiveView('project');
    const firstTask = taskList.find((task) => task.projectId === project.id);
    if (firstTask) setSelectedTask(firstTask);
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const targetStatus = event.over?.id as Status | undefined;
    if (!targetStatus || !statuses.includes(targetStatus)) return;
    setTaskList((items) => items.map((task) => task.id === taskId ? { ...task, status: targetStatus } : task));
    const moved = taskList.find((task) => task.id === taskId);
    if (moved) setSelectedTask({ ...moved, status: targetStatus });
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">TP</div><div><strong>Thing Planner</strong><span>Project OS v0.3.0</span></div></div>
      <div className="user-panel">
        <div className="avatar">{currentUser.avatar}</div>
        <div><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div>
      </div>
      <select className="select" value={currentUser.id} onChange={(e) => setCurrentUser(userById(e.target.value))}>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
      </select>
      <nav className="nav">
        <button className={activeView === 'portfolio' ? 'active' : ''} onClick={() => setActiveView('portfolio')}><LayoutDashboard size={18}/> Portfolio</button>
        <button className={activeView === 'project' ? 'active' : ''} onClick={() => setActiveView('project')}><KanbanSquare size={18}/> Project Board</button>
        <button className={activeView === 'wbs' ? 'active' : ''} onClick={() => setActiveView('wbs')}><Layers3 size={18}/> WBS</button>
        <button className={activeView === 'relationships' ? 'active' : ''} onClick={() => setActiveView('relationships')}><GitBranch size={18}/> Relationships</button>
        <button className={activeView === 'reports' ? 'active' : ''} onClick={() => setActiveView('reports')}><ClipboardList size={18}/> Reports</button>
        {currentUser.role === 'Admin' && <button className={activeView === 'admin' ? 'active' : ''} onClick={() => setActiveView('admin')}><Shield size={18}/> Admin</button>}
      </nav>
      <div className="project-list-title">Projects</div>
      <div className="project-list">
        {accessibleProjects.map((project) => <button className={project.id === selectedProject?.id ? 'project-chip selected' : 'project-chip'} key={project.id} onClick={() => selectProject(project)}>
          <span>{project.name}</span><Pill tone={project.health === 'Green' ? 'green' : project.health === 'Red' ? 'red' : 'yellow'}>{project.health}</Pill>
        </button>)}
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div>
          <div className="breadcrumbs">Workspace <ChevronRight size={14}/> {activeView} <ChevronRight size={14}/> {selectedProject?.name}</div>
          <h1>{activeView === 'portfolio' ? 'Portfolio Command Center' : selectedProject?.name}</h1>
          <p>{selectedProject?.goal}</p>
        </div>
        <div className="actions"><button><Search size={16}/> Search</button><button><Download size={16}/> Export</button><button className="primary"><Sparkles size={16}/> AI Plan</button></div>
      </header>

      {activeView === 'portfolio' && <Portfolio projects={accessibleProjects} taskList={taskList} selectProject={selectProject} />}
      {activeView === 'project' && selectedProject && <ProjectBoard project={selectedProject} tasks={filteredTasks} query={query} setQuery={setQuery} onDragEnd={handleDragEnd} selectTask={(task) => { setSelectedTask(task); setDrawerMode('task'); }} />}
      {activeView === 'wbs' && selectedProject && <WbsView project={selectedProject} tasks={filteredTasks} selectTask={(task) => { setSelectedTask(task); setDrawerMode('task'); }} />}
      {activeView === 'relationships' && selectedProject && <RelationshipView project={selectedProject} tasks={projectTasks} selectTask={(task) => { setSelectedTask(task); setDrawerMode('task'); }} selectPhase={(phaseId) => { setSelectedPhaseId(phaseId); setDrawerMode('phase'); }} />}
      {activeView === 'reports' && selectedProject && <Reports project={selectedProject} tasks={projectTasks} />}
      {activeView === 'admin' && <AdminConsole user={currentUser} openAdmin={() => { setDrawerMode('admin'); }} />}
    </main>

    <aside className="drawer">
      {drawerMode === 'task' && selectedTask && <TaskDrawer task={selectedTask} />}
      {drawerMode === 'phase' && <PhaseDrawer phaseId={selectedPhaseId} />}
      {drawerMode === 'admin' && <AdminDrawer />}
    </aside>
  </div>;
}

function Portfolio({ projects: visible, taskList, selectProject }: { projects: Project[]; taskList: Task[]; selectProject: (project: Project) => void }) {
  const totalTasks = taskList.filter((task) => visible.some((project) => project.id === task.projectId));
  const blocked = totalTasks.filter((task) => task.status === 'Blocked').length;
  const review = totalTasks.filter((task) => task.status === 'Review').length;
  return <section className="content-grid">
    <div className="metrics-row">
      <MetricCard label="Active projects" value={visible.length} helper="Projects visible to this role" icon={<Boxes/>}/>
      <MetricCard label="Blocked tasks" value={blocked} helper="Needs decision, dependency, or repair" icon={<AlertTriangle/>}/>
      <MetricCard label="In review" value={review} helper="Waiting validation or approval" icon={<CheckCircle2/>}/>
      <MetricCard label="Admin controls" value="Ready" helper="Users, repair, archive, restore" icon={<UserCog/>}/>
    </div>
    <div className="panel wide">
      <div className="panel-head"><div><h2>Project portfolio</h2><p>Click a project to drill into its dashboard, WBS, Kanban board, and relationship map.</p></div></div>
      <div className="project-grid">
        {visible.map((project) => {
          const stats = projectStats(project);
          return <button className="project-card" key={project.id} onClick={() => selectProject(project)}>
            <div className="project-card-head"><Pill tone="blue">{project.type}</Pill><Pill tone={project.health === 'Green' ? 'green' : 'yellow'}>{project.health}</Pill></div>
            <h3>{project.name}</h3><p>{project.goal}</p>
            <div className="progress"><span style={{ width: `${stats.progress}%` }} /></div>
            <div className="mini-stats"><span>{stats.progress}% complete</span><span>{stats.blocked} blocked</span><span>{stats.highPriority} high priority</span></div>
          </button>;
        })}
      </div>
    </div>
    <div className="panel"><h2>AI project coach</h2><p className="muted">Suggested next actions based on project health, blockers, and upcoming milestones.</p><ul className="clean-list"><li><Bot/> Convert completed projects into reusable templates.</li><li><Wrench/> Resolve v0.3.0 backend persistence issue before collaboration.</li><li><CalendarClock/> Review milestones due within 10 days.</li></ul></div>
    <div className="panel"><h2>Recent activity</h2>{projectActivity('p1').map((event) => <div className="activity" key={event.id}><strong>{userById(event.actorId).name}</strong><span>{event.message}</span></div>)}</div>
  </section>;
}

function ProjectBoard({ project, tasks, query, setQuery, onDragEnd, selectTask }: { project: Project; tasks: Task[]; query: string; setQuery: (value: string) => void; onDragEnd: (event: DragEndEvent) => void; selectTask: (task: Task) => void }) {
  const stats = projectStats(project);
  return <section className="content-grid">
    <div className="metrics-row">
      <MetricCard label="Progress" value={`${calculateProgress(project)}%`} helper="Done tasks / total tasks" icon={<CheckCircle2/>}/>
      <MetricCard label="Tasks" value={stats.total} helper="Unified task model" icon={<ClipboardList/>}/>
      <MetricCard label="Blocked" value={stats.blocked} helper="Click Blocked column to review" icon={<AlertTriangle/>}/>
      <MetricCard label="Milestones" value={project.milestoneIds.length} helper="Linked to phases and tasks" icon={<CalendarClock/>}/>
    </div>
    <div className="panel wide">
      <div className="panel-head"><div><h2>Kanban workflow</h2><p>Drag cards across columns. Each card retains references to phase, milestone, risk, issue, owner, dependency, and acceptance criteria.</p></div><input className="search" placeholder="Filter tasks, owner, WBS, status..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <DndContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {statuses.map((status) => <div className="kanban-col" id={status} key={status}>
            <div className="kanban-title"><strong>{status}</strong><span>{tasks.filter((task) => task.status === status).length}</span></div>
            {tasks.filter((task) => task.status === status).map((task) => <TaskCard key={task.id} task={task} selectTask={selectTask} />)}
          </div>)}
        </div>
      </DndContext>
    </div>
  </section>;
}

function TaskCard({ task, selectTask }: { task: Task; selectTask: (task: Task) => void }) {
  const phase = phaseById(task.phaseId);
  const milestone = milestoneById(task.milestoneId);
  return <button className="task-card" onClick={() => selectTask(task)}>
    <div className="task-top"><span>{task.wbs}</span><Pill tone={task.priority === 'Critical' ? 'red' : task.priority === 'High' ? 'yellow' : 'neutral'}>{task.priority}</Pill></div>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <div className="ref-row"><Pill tone="purple">{phase?.name}</Pill><Pill tone="blue">{milestone?.name}</Pill></div>
    <div className="task-foot"><span>{userById(task.ownerId).name}</span><span>{task.dueDate}</span></div>
  </button>;
}

function WbsView({ project, tasks, selectTask }: { project: Project; tasks: Task[]; selectTask: (task: Task) => void }) {
  return <section className="panel wide"><div className="panel-head"><div><h2>Work Breakdown Structure</h2><p>Trace project → phase → milestone → task → references.</p></div></div>
    <table><thead><tr><th>WBS</th><th>Task</th><th>Phase</th><th>Milestone</th><th>Owner</th><th>Status</th><th>References</th></tr></thead><tbody>
      {tasks.map((task) => <tr key={task.id} onClick={() => selectTask(task)}><td>{task.wbs}</td><td><strong>{task.title}</strong><br/><span>{task.description}</span></td><td>{phaseById(task.phaseId)?.name}</td><td>{milestoneById(task.milestoneId)?.name}</td><td>{userById(task.ownerId).name}</td><td><Pill>{task.status}</Pill></td><td>{task.riskIds.length} risks · {task.issueIds.length} issues · {task.dependencyIds.length} deps</td></tr>)}
    </tbody></table></section>;
}

function RelationshipView({ project, tasks, selectTask, selectPhase }: { project: Project; tasks: Task[]; selectTask: (task: Task) => void; selectPhase: (phaseId: string) => void }) {
  const projectPhases = phases.filter((phase) => phase.projectId === project.id);
  return <section className="relationship-wrap">
    <div className="relationship-node project-node"><strong>{project.name}</strong><span>{project.type} · {project.health}</span></div>
    <div className="relationship-lanes">
      {projectPhases.map((phase) => <div className="relationship-lane" key={phase.id}>
        <button className="relationship-node phase-node" onClick={() => selectPhase(phase.id)}><strong>{phase.name}</strong><span>{phase.progress}% · {phase.status}</span></button>
        {milestones.filter((milestone) => milestone.phaseId === phase.id).map((milestone) => <div className="relationship-node milestone-node" key={milestone.id}><strong>{milestone.name}</strong><span>{milestone.dueDate}</span></div>)}
        {tasks.filter((task) => task.phaseId === phase.id).map((task) => <button className="relationship-node task-node" key={task.id} onClick={() => selectTask(task)}><strong>{task.wbs} {task.title}</strong><span>{task.status} · {userById(task.ownerId).name}</span></button>)}
      </div>)}
    </div>
  </section>;
}

function Reports({ project, tasks }: { project: Project; tasks: Task[] }) {
  const stats = projectStats(project);
  return <section className="content-grid"><div className="panel wide"><h2>Executive status report</h2><div className="report-box">
    <h3>{project.name}</h3><p><strong>Health:</strong> {project.health}</p><p><strong>Progress:</strong> {stats.progress}% complete with {stats.blocked} blocked task(s).</p><p><strong>Current focus:</strong> Complete high-priority work, resolve linked issues, and prepare next milestone.</p><p><strong>Traceability:</strong> {project.phaseIds.length} phases, {project.milestoneIds.length} milestones, {tasks.length} tasks, {project.riskIds.length} risks, {project.issueIds.length} issues.</p>
  </div></div><div className="panel"><h2>Export options</h2><button className="big-action"><Download/> Export project JSON</button><button className="big-action"><Download/> Export task CSV</button><button className="big-action"><ClipboardList/> Generate status Markdown</button></div></section>;
}

function AdminConsole({ user, openAdmin }: { user: User; openAdmin: () => void }) {
  if (user.role !== 'Admin') return <section className="panel"><h2>Access denied</h2><p>Admin tools require the Admin role.</p></section>;
  return <section className="content-grid"><div className="metrics-row"><MetricCard label="Users" value={users.length} helper="Active demo accounts" icon={<Users/>}/><MetricCard label="Projects" value={projects.length} helper="All workspace projects" icon={<Boxes/>}/><MetricCard label="Repair tools" value="6" helper="Validation and recovery actions" icon={<Wrench/>}/><MetricCard label="Audit mode" value="On" helper="Activity and admin trail" icon={<LockKeyhole/>}/></div><div className="panel wide"><div className="panel-head"><div><h2>Admin console</h2><p>Manage users, project ownership, repair tools, archive/restore, and system exports.</p></div><button className="primary" onClick={openAdmin}><Settings/> Open tools</button></div><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td><Pill tone={item.role === 'Admin' ? 'red' : item.role === 'Power User' ? 'purple' : 'neutral'}>{item.role}</Pill></td><td>{projects.filter((project) => project.memberIds.includes(item.id)).length} projects</td></tr>)}</tbody></table></div></section>;
}

function TaskDrawer({ task }: { task: Task }) {
  return <div><div className="drawer-head"><div><span className="eyebrow">Task drill-down</span><h2>{task.title}</h2></div><button><X size={16}/></button></div><p>{task.description}</p><div className="drawer-section"><h3>Smart references</h3><div className="ref-stack"><span><strong>WBS:</strong> {task.wbs}</span><span><strong>Phase:</strong> {phaseById(task.phaseId)?.name}</span><span><strong>Milestone:</strong> {milestoneById(task.milestoneId)?.name}</span><span><strong>Owner:</strong> {userById(task.ownerId).name}</span><span><strong>Dependencies:</strong> {task.dependencyIds.map((id) => demoTasks.find((t) => t.id === id)?.title).filter(Boolean).join(', ') || 'None'}</span></div></div><div className="drawer-section"><h3>Risks and issues</h3>{task.riskIds.map((id) => <Pill key={id} tone="yellow">Risk: {riskById(id)?.title}</Pill>)}{task.issueIds.map((id) => <Pill key={id} tone="red">Issue: {issueById(id)?.title}</Pill>)}{!task.riskIds.length && !task.issueIds.length && <p className="muted">No linked risks or issues.</p>}</div><div className="drawer-section"><h3>Acceptance criteria</h3><ul>{task.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="drawer-section"><h3>Evidence</h3><p>{task.evidence.length ? task.evidence.join(', ') : 'No evidence attached yet.'}</p></div></div>;
}

function PhaseDrawer({ phaseId }: { phaseId: string }) {
  const phase = phaseById(phaseId);
  if (!phase) return null;
  return <div><span className="eyebrow">Phase drill-down</span><h2>{phase.name}</h2><p>{phase.description}</p><div className="progress big"><span style={{ width: `${phase.progress}%` }}/></div><div className="drawer-section"><h3>Milestones</h3>{milestones.filter((milestone) => milestone.phaseId === phase.id).map((milestone) => <div className="activity" key={milestone.id}><strong>{milestone.name}</strong><span>{milestone.status} · due {milestone.dueDate}</span></div>)}</div></div>;
}

function AdminDrawer() {
  return <div><span className="eyebrow">Admin repair tools</span><h2>Project operations</h2><div className="drawer-section"><button className="big-action"><Wrench/> Recalculate project health</button><button className="big-action"><Layers3/> Rebuild WBS numbering</button><button className="big-action"><Database/> Validate imported data</button><button className="big-action"><Archive/> Restore archived project</button></div><p className="muted">These are frontend-ready controls. v0.4 should connect them to real API actions and audit records.</p></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
