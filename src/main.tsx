import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, Archive, BarChart3, Bot, Boxes, Brain, Briefcase, Building2, CalendarClock, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, ClipboardList, Columns3, Database, Download, Gauge, GitBranch, KanbanSquare, Layers3, LayoutDashboard, Link2, LockKeyhole, Mail, MessageSquare, Plus, Search, Settings, Shield, Sparkles, Table2, Target, Timer, TrendingUp, UserCog, UserPlus, Users, WandSparkles, Wrench, X, Zap } from 'lucide-react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { projects, users, tasks as demoTasks, phases, milestones, risks, issues } from './data/demo';
import type { Project, Status, Task, User } from './types';
import { issueById, milestoneById, phaseById, projectActivity, riskById, statuses, userById, visibleProjects } from './lib/selectors';
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

type ThemeName = 'midnight' | 'slate' | 'light' | 'executive';
type ViewName = 'portfolio' | 'project' | 'ai' | 'forecast' | 'resources' | 'crm' | 'wbs' | 'relationships' | 'reports' | 'admin';

type ResourceMonth = { label: string; status: 'Full' | 'Available' | 'Overallocated'; hours: string };
type ResourceRow = { name: string; role: string; avatar: string; match: number; months: ResourceMonth[] };
type CrmRow = { account: string; contact: string; workstream: string; stage: string; value: string; ownerId: string; health: 'Green' | 'Yellow' | 'Red'; nextAction: string };

const resources: ResourceRow[] = [
  { name: 'Morgan Lee', role: 'Frontend / UX', avatar: 'ML', match: 96, months: [{ label: 'Jan', status: 'Full', hours: '8h left' }, { label: 'Feb', status: 'Available', hours: '76h left' }, { label: 'Mar', status: 'Available', hours: '46h left' }, { label: 'Apr', status: 'Available', hours: '32h left' }] },
  { name: 'Jamie Rivera', role: 'Field execution', avatar: 'JR', match: 91, months: [{ label: 'Jan', status: 'Overallocated', hours: '122h over' }, { label: 'Feb', status: 'Available', hours: '16h left' }, { label: 'Mar', status: 'Full', hours: 'Full' }, { label: 'Apr', status: 'Available', hours: '90h left' }] },
  { name: 'Taylor Kim', role: 'Stakeholder review', avatar: 'TK', match: 88, months: [{ label: 'Jan', status: 'Available', hours: '24h left' }, { label: 'Feb', status: 'Overallocated', hours: '120h over' }, { label: 'Mar', status: 'Available', hours: '90h left' }, { label: 'Apr', status: 'Available', hours: '90h left' }] },
];

const crmRows: CrmRow[] = [
  { account: 'Francis Workspace', contact: 'Adrian Francis', workstream: 'Thing Planner PM', stage: 'Implementation', value: '$18.5k est.', ownerId: 'u1', health: 'Green', nextAction: 'Approve v0.4 backend scope' },
  { account: 'Auto Repair', contact: 'Parts supplier', workstream: 'BMW Repair Planner', stage: 'Procurement', value: '$1.2k est.', ownerId: 'u3', health: 'Yellow', nextAction: 'Confirm compatibility and delivery' },
  { account: 'Home Projects', contact: 'Materials vendor', workstream: 'Kitchen Island Refinish', stage: 'Quote / materials', value: '$450 est.', ownerId: 'u1', health: 'Yellow', nextAction: 'Lock finish approach' },
  { account: 'Future Client', contact: 'Team lead', workstream: 'Project OS demo', stage: 'Pipeline', value: '$35k est.', ownerId: 'u2', health: 'Green', nextAction: 'Send demo workspace link' },
];

function statsForProject(project: Project, list: Task[]) {
  const projectTasks = list.filter((task) => task.projectId === project.id);
  const total = projectTasks.length;
  const done = projectTasks.filter((task) => task.status === 'Done').length;
  return {
    total,
    done,
    blocked: projectTasks.filter((task) => task.status === 'Blocked').length,
    review: projectTasks.filter((task) => task.status === 'Review').length,
    overdue: projectTasks.filter((task) => task.status !== 'Done' && new Date(task.dueDate) < new Date('2026-07-03')).length,
    highPriority: projectTasks.filter((task) => task.priority === 'High' || task.priority === 'Critical').length,
    progress: total ? Math.round((done / total) * 100) : 0,
  };
}

function healthTone(health: string): 'green' | 'yellow' | 'red' {
  if (health === 'Green') return 'green';
  if (health === 'Red') return 'red';
  return 'yellow';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [activeView, setActiveView] = useState<ViewName>('portfolio');
  const [taskList, setTaskList] = useState<Task[]>(demoTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerMode, setDrawerMode] = useState<'task' | 'phase' | 'admin' | 'ai' | null>(null);
  const [theme, setTheme] = useState<ThemeName>(() => (localStorage.getItem('thing-planner-theme') as ThemeName) || 'light');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('ph2');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('thing-planner-theme', theme);
  }, [theme]);

  const accessibleProjects = useMemo(() => visibleProjects(currentUser), [currentUser]);
  const selectedProject = accessibleProjects.find((project) => project.id === selectedProjectId) ?? accessibleProjects[0];
  const projectTasks = taskList.filter((task) => task.projectId === selectedProject?.id);
  const filteredTasks = projectTasks.filter((task) => [task.title, task.description, task.wbs, task.status, userById(task.ownerId).name, phaseById(task.phaseId)?.name, milestoneById(task.milestoneId)?.name].join(' ').toLowerCase().includes(query.toLowerCase()));

  function selectProject(project: Project) {
    setSelectedProjectId(project.id);
    setActiveView('project');
    setSelectedTask(null);
    setDrawerMode(null);
  }

  function openTask(task: Task) {
    setSelectedTask(task);
    setDrawerMode('task');
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const targetStatus = event.over?.id as Status | undefined;
    if (!targetStatus || !statuses.includes(targetStatus)) return;
    setTaskList((items) => items.map((task) => task.id === taskId ? { ...task, status: targetStatus } : task));
    const moved = taskList.find((task) => task.id === taskId);
    if (moved) setSelectedTask({ ...moved, status: targetStatus });
  }

  const closeDrawer = () => { setSelectedTask(null); setDrawerMode(null); };
  const viewTitle = activeView === 'portfolio' ? 'Portfolio Command Center' : activeView === 'ai' ? 'AI Work Intelligence' : activeView === 'forecast' ? 'Predictive Delivery Center' : activeView === 'resources' ? 'Resource Capacity Planner' : activeView === 'crm' ? 'CRM Work Pipeline' : selectedProject?.name;
  const viewSubtitle = activeView === 'portfolio'
    ? 'AI-driven project management for every team with enterprise-grade visibility.'
    : activeView === 'ai'
      ? 'Sidekick actions, timeline adjustments, risk prompts, and auto-generated project support.'
      : activeView === 'forecast'
        ? 'Predicted end date, delivery risk, budget impact, pace, and capacity signals.'
        : activeView === 'resources'
          ? 'Find available team members, see capacity gaps, and avoid over-allocation.'
          : activeView === 'crm'
            ? 'Track accounts, contacts, workstreams, project value, next actions, and health.'
            : selectedProject?.goal;

  return <div className={`app-shell ${drawerMode ? 'drawer-open' : 'drawer-closed'}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">TP</div><div><strong>Thing Planner</strong><span>Project OS v0.3.4</span></div></div>
      <div className="user-panel">
        <div className="avatar">{currentUser.avatar}</div>
        <div><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div>
      </div>
      <label className="field-label">Demo account</label>
      <select className="select" value={currentUser.id} onChange={(e) => setCurrentUser(userById(e.target.value))}>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
      </select>
      <label className="field-label">Theme</label>
      <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
        <option value="light">Light Workspace</option>
        <option value="executive">Executive Blue</option>
        <option value="slate">Slate Professional</option>
        <option value="midnight">Midnight Command</option>
      </select>
      <nav className="nav">
        <button className={activeView === 'portfolio' ? 'active' : ''} onClick={() => setActiveView('portfolio')}><LayoutDashboard size={18}/> Portfolio</button>
        <button className={activeView === 'project' ? 'active' : ''} onClick={() => setActiveView('project')}><KanbanSquare size={18}/> Project Board</button>
        <button className={activeView === 'ai' ? 'active' : ''} onClick={() => setActiveView('ai')}><Sparkles size={18}/> AI Command</button>
        <button className={activeView === 'forecast' ? 'active' : ''} onClick={() => setActiveView('forecast')}><TrendingUp size={18}/> Forecast</button>
        <button className={activeView === 'resources' ? 'active' : ''} onClick={() => setActiveView('resources')}><Users size={18}/> Resources</button>
        <button className={activeView === 'crm' ? 'active' : ''} onClick={() => setActiveView('crm')}><Briefcase size={18}/> CRM</button>
        <button className={activeView === 'wbs' ? 'active' : ''} onClick={() => setActiveView('wbs')}><Layers3 size={18}/> WBS</button>
        <button className={activeView === 'relationships' ? 'active' : ''} onClick={() => setActiveView('relationships')}><GitBranch size={18}/> Relationships</button>
        <button className={activeView === 'reports' ? 'active' : ''} onClick={() => setActiveView('reports')}><ClipboardList size={18}/> Reports</button>
        {currentUser.role === 'Admin' && <button className={activeView === 'admin' ? 'active' : ''} onClick={() => setActiveView('admin')}><Shield size={18}/> Admin</button>}
      </nav>
      <div className="project-list-title">Projects</div>
      <div className="project-list">
        {accessibleProjects.map((project) => <button className={project.id === selectedProject?.id ? 'project-chip selected' : 'project-chip'} key={project.id} onClick={() => selectProject(project)}>
          <span>{project.name}</span><Pill tone={healthTone(project.health)}>{project.health}</Pill>
        </button>)}
      </div>
    </aside>

    <main className="main">
      <header className="topbar hero-topbar">
        <div>
          <div className="breadcrumbs">Workspace <ChevronRight size={14}/> {activeView} <ChevronRight size={14}/> {selectedProject?.name}</div>
          <h1>{viewTitle}</h1>
          <p>{viewSubtitle}</p>
        </div>
        <div className="actions"><button onClick={() => setActiveView('project')}><Search size={16}/> Search</button><button><Download size={16}/> Export</button><button className="primary" onClick={() => { setDrawerMode('ai'); }}><Sparkles size={16}/> AI Plan</button></div>
      </header>

      {activeView === 'portfolio' && <Portfolio projects={accessibleProjects} taskList={taskList} selectProject={selectProject} setActiveView={setActiveView} />}
      {activeView === 'project' && selectedProject && <ProjectBoard project={selectedProject} tasks={filteredTasks} allTasks={taskList} query={query} setQuery={setQuery} onDragEnd={handleDragEnd} selectTask={openTask} setActiveView={setActiveView} />}
      {activeView === 'ai' && selectedProject && <AiCommandCenter project={selectedProject} tasks={projectTasks} setActiveView={setActiveView} />}
      {activeView === 'forecast' && selectedProject && <ForecastView project={selectedProject} tasks={projectTasks} setActiveView={setActiveView} />}
      {activeView === 'resources' && <ResourcePlanner />}
      {activeView === 'crm' && <CrmPipeline />}
      {activeView === 'wbs' && selectedProject && <WbsView project={selectedProject} tasks={filteredTasks} selectTask={openTask} />}
      {activeView === 'relationships' && selectedProject && <RelationshipView project={selectedProject} tasks={projectTasks} selectTask={openTask} selectPhase={(phaseId) => { setSelectedPhaseId(phaseId); setDrawerMode('phase'); }} />}
      {activeView === 'reports' && selectedProject && <Reports project={selectedProject} tasks={projectTasks} />}
      {activeView === 'admin' && <AdminConsole user={currentUser} openAdmin={() => { setDrawerMode('admin'); }} />}
    </main>

    {drawerMode && <aside className="drawer">
      {drawerMode === 'task' && selectedTask && <TaskDrawer task={selectedTask} taskList={taskList} onClose={closeDrawer} />}
      {drawerMode === 'phase' && <PhaseDrawer phaseId={selectedPhaseId} onClose={closeDrawer} />}
      {drawerMode === 'admin' && <AdminDrawer onClose={closeDrawer} />}
      {drawerMode === 'ai' && selectedProject && <AiDrawer project={selectedProject} onClose={closeDrawer} />}
    </aside>}
  </div>;
}

function Portfolio({ projects: visible, taskList, selectProject, setActiveView }: { projects: Project[]; taskList: Task[]; selectProject: (project: Project) => void; setActiveView: (view: ViewName) => void }) {
  const totalTasks = taskList.filter((task) => visible.some((project) => project.id === task.projectId));
  const blocked = totalTasks.filter((task) => task.status === 'Blocked').length;
  const review = totalTasks.filter((task) => task.status === 'Review').length;
  const atRisk = visible.filter((project) => project.health !== 'Green').length;
  return <section className="content-grid">
    <div className="ai-hero wide">
      <div>
        <Pill tone="purple"><Sparkles size={13}/> AI-driven Project OS</Pill>
        <h2>Plan work, predict risk, balance capacity, and keep every project connected.</h2>
        <p>Portfolio, Kanban, WBS, CRM pipeline, resource heatmaps, forecast signals, and AI sidekick suggestions are all connected to the same project model.</p>
      </div>
      <div className="hero-actions">
        <button className="primary" onClick={() => setActiveView('ai')}><WandSparkles/> Open AI Command</button>
        <button onClick={() => setActiveView('forecast')}><TrendingUp/> View forecast</button>
      </div>
    </div>
    <div className="metrics-row">
      <MetricCard label="Active projects" value={visible.length} helper="Projects visible to this role" icon={<Boxes/>}/>
      <MetricCard label="At risk" value={atRisk} helper="Yellow or red project health" icon={<AlertTriangle/>} onClick={() => setActiveView('forecast')}/>
      <MetricCard label="In review" value={review} helper="Waiting validation or approval" icon={<CheckCircle2/>}/>
      <MetricCard label="Blocked tasks" value={blocked} helper="Needs decision, dependency, or repair" icon={<Wrench/>}/>
    </div>
    <div className="panel wide">
      <div className="panel-head"><div><h2>Project portfolio</h2><p>Click a project to drill into its board, WBS, forecast, relationships, and executive status.</p></div><div className="view-tabs"><button className="active"><Table2 size={14}/> Main table</button><button onClick={() => setActiveView('forecast')}><BarChart3 size={14}/> Forecast</button><button onClick={() => setActiveView('resources')}><Users size={14}/> Resources</button></div></div>
      <div className="project-grid">
        {visible.map((project) => {
          const stats = statsForProject(project, taskList);
          return <button className="project-card" key={project.id} onClick={() => selectProject(project)}>
            <div className="project-card-head"><Pill tone="blue">{project.type}</Pill><Pill tone={healthTone(project.health)}>{project.health}</Pill></div>
            <h3>{project.name}</h3><p>{project.goal}</p>
            <div className="progress"><span style={{ width: `${stats.progress}%` }} /></div>
            <div className="mini-stats"><span>{stats.progress}% complete</span><span>{stats.blocked} blocked</span><span>{stats.highPriority} priority</span></div>
          </button>;
        })}
      </div>
    </div>
    <div className="panel"><h2>AI sidekick suggestions</h2><p className="muted">Practical recommendations generated from workload, blockers, and due dates.</p><ul className="clean-list"><li><Bot/> Adjust project timelines where blocked work touches key milestones.</li><li><UserPlus/> Flag overallocated team members before assigning new work.</li><li><ClipboardList/> Summarize updates and assign next actions across the portfolio.</li></ul></div>
    <div className="panel"><h2>Enterprise visibility</h2><div className="signal-list"><div><Gauge/><strong>Portfolio health</strong><span>{visible.length - atRisk} green · {atRisk} attention needed</span></div><div><CircleDollarSign/><strong>Budget exposure</strong><span>$150k forecast variance demo signal</span></div><div><Timer/><strong>Predicted slippage</strong><span>+29 days on highest-risk plan</span></div></div></div>
  </section>;
}

function ProjectBoard({ project, tasks, allTasks, query, setQuery, onDragEnd, selectTask, setActiveView }: { project: Project; tasks: Task[]; allTasks: Task[]; query: string; setQuery: (value: string) => void; onDragEnd: (event: DragEndEvent) => void; selectTask: (task: Task) => void; setActiveView: (view: ViewName) => void }) {
  const stats = statsForProject(project, allTasks);
  return <section className="content-grid">
    <div className="metrics-row">
      <MetricCard label="Progress" value={`${stats.progress}%`} helper="Done tasks / total tasks" icon={<CheckCircle2/>}/>
      <MetricCard label="Tasks" value={stats.total} helper="Unified task model" icon={<ClipboardList/>}/>
      <MetricCard label="Blocked" value={stats.blocked} helper="Click Blocked column to review" icon={<AlertTriangle/>}/>
      <MetricCard label="Milestones" value={project.milestoneIds.length} helper="Linked to phases and tasks" icon={<CalendarClock/>}/>
    </div>
    <div className="panel wide">
      <div className="panel-head"><div><h2>Team planning</h2><p>Drag cards across columns. Every card keeps smart references to phase, milestone, risk, owner, dependency, and acceptance criteria.</p></div><div className="view-tabs"><button className="active"><KanbanSquare size={14}/> Kanban</button><button onClick={() => setActiveView('wbs')}><Table2 size={14}/> Main table</button><button onClick={() => setActiveView('forecast')}><BarChart3 size={14}/> Forecast</button><button onClick={() => setActiveView('ai')}><Sparkles size={14}/> AI</button></div></div>
      <input className="search" placeholder="Filter tasks, owner, WBS, phase, milestone, status..." value={query} onChange={(event) => setQuery(event.target.value)} />
      <DndContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {statuses.map((status) => <KanbanColumn key={status} status={status} tasks={tasks.filter((task) => task.status === status)} selectTask={selectTask} />)}
        </div>
      </DndContext>
    </div>
  </section>;
}

function KanbanColumn({ status, tasks, selectTask }: { status: Status; tasks: Task[]; selectTask: (task: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return <div ref={setNodeRef} className={`kanban-col ${isOver ? 'drop-over' : ''}`}>
    <div className="kanban-title"><strong>{status}</strong><span>{tasks.length}</span></div>
    {tasks.map((task) => <TaskCard key={task.id} task={task} selectTask={selectTask} />)}
  </div>;
}

function TaskCard({ task, selectTask }: { task: Task; selectTask: (task: Task) => void }) {
  const phase = phaseById(task.phaseId);
  const milestone = milestoneById(task.milestoneId);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return <article ref={setNodeRef} style={style} className={`task-card ${isDragging ? 'dragging' : ''}`} onClick={() => selectTask(task)}>
    <div className="task-top"><button className="drag-handle" {...listeners} {...attributes} aria-label={`Drag ${task.title}`}>⋮⋮</button><span>{task.wbs}</span><Pill tone={task.priority === 'Critical' ? 'red' : task.priority === 'High' ? 'yellow' : 'neutral'}>{task.priority}</Pill></div>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <div className="ref-row"><Pill tone="purple">{phase?.name}</Pill><Pill tone="blue">{milestone?.name}</Pill></div>
    <div className="task-foot"><span>{userById(task.ownerId).name}</span><span>{task.dueDate}</span></div>
  </article>;
}

function AiCommandCenter({ project, tasks, setActiveView }: { project: Project; tasks: Task[]; setActiveView: (view: ViewName) => void }) {
  const blocked = tasks.filter((task) => task.status === 'Blocked');
  const dueSoon = tasks.filter((task) => task.status !== 'Done').slice(0, 3);
  return <section className="content-grid">
    <div className="panel wide ai-board">
      <div className="panel-head"><div><h2>AI action suggestions</h2><p>Sidekick-style actions for project planning, delivery risk, task assignment, and reporting.</p></div><button className="primary"><Sparkles/> Generate plan update</button></div>
      <div className="ai-command-layout">
        <div className="planning-table">
          <div className="table-title"><h3>{project.name}</h3><div className="view-tabs"><button className="active">Main table</button><button onClick={() => setActiveView('forecast')}>Gantt</button><button onClick={() => setActiveView('project')}>Kanban</button><button>+</button></div></div>
          <div className="planning-row header"><span>Task</span><span>Owner</span><span>Timeline</span><span>Status</span><span>Due</span></div>
          {tasks.slice(0, 6).map((task, index) => <div className="planning-row" key={task.id}><span>{task.title}</span><span><span className="mini-avatar">{userById(task.ownerId).avatar}</span></span><span><div className="timeline-pill"><i style={{ width: `${Math.max(22, 90 - index * 10)}%` }} /></div></span><span><Pill tone={task.status === 'Done' ? 'green' : task.status === 'Blocked' ? 'red' : task.status === 'In Progress' ? 'yellow' : 'blue'}>{task.status}</Pill></span><span>{task.dueDate.slice(5)}</span></div>)}
        </div>
        <div className="sidekick-card">
          <div className="sidekick-brand"><Sparkles/><strong>Planner sidekick</strong></div>
          <h3>AI action suggestions</h3>
          <button><Zap/> Adjust project timelines</button>
          <button><UserPlus/> Flag overloaded team members</button>
          <button><ClipboardList/> Summarize updates and assign tasks</button>
          <div className="thinking"><Sparkles/> Thinking...<span/><span/><span/></div>
        </div>
      </div>
    </div>
    <div className="panel"><h2>Scope clarifier</h2><ul className="clean-list"><li><Brain/> Ask three setup questions before adding new phases.</li><li><Target/> Validate success criteria and acceptance evidence.</li><li><Link2/> Link every generated task to a milestone and owner.</li></ul></div>
    <div className="panel"><h2>Delivery focus</h2><ul className="clean-list">{blocked.length ? blocked.map((task) => <li key={task.id}><AlertTriangle/> Resolve blocker: {task.title}</li>) : dueSoon.map((task) => <li key={task.id}><CalendarDays/> Keep moving: {task.title}</li>)}</ul></div>
  </section>;
}

function ForecastView({ project, tasks, setActiveView }: { project: Project; tasks: Task[]; setActiveView: (view: ViewName) => void }) {
  const stats = statsForProject(project, tasks);
  return <section className="content-grid forecast-grid">
    <div className="panel wide prediction-panel">
      <div className="panel-head"><div><h2>Predicted Project End</h2><p>Simulated forecast using task progress, team focus, pace, budget, and capacity signals.</p></div><button onClick={() => setActiveView('resources')}><Users/> Find capacity</button></div>
      <div className="prediction-layout">
        <div className="forecast-cards"><div><span>Deadline</span><strong>{project.targetDate.slice(5)}</strong><span>Plan remaining</span><strong>31h</strong></div><div><span>Task performance</span><strong>{Math.max(72, 90 - stats.blocked * 8)}%</strong><span>Team focus</span><strong>90%</strong></div><div><span>Optimistic</span><strong>Nov 21</strong><span>Predicted</span><strong>Jan 7</strong><span>Conservative</span><strong>Jan 17</strong></div></div>
        <div className="forecast-chart"><svg viewBox="0 0 640 300" role="img" aria-label="Predicted project end chart"><path d="M40 250 H600 M40 200 H600 M40 150 H600 M40 100 H600 M40 50 H600" className="gridline"/><path d="M55 250 L85 180 L120 170 L145 120 L190 118 L230 92 L275 92 L330 55 L595 55" className="planned"/><path d="M55 250 L95 210 L130 160 L165 140 L220 125 L300 110 L390 95 L500 80 L595 58" className="forecast"/><line x1="470" y1="40" x2="470" y2="260" className="deadline"/><line x1="560" y1="40" x2="560" y2="260" className="riskline"/><text x="448" y="82">Deadline</text><text x="548" y="82">+29 days</text></svg><div className="chart-legend"><span><i className="legend-complete"/> Completed</span><span><i className="legend-plan"/> Planned work</span><Pill tone="red">Margin Risk</Pill></div></div>
        <div className="forecast-status"><h3>Status</h3><StatusSignal icon={<Timer/>} title="Predicted time slippage" tag="High Risk" tone="red" detail="+29 days"/><StatusSignal icon={<CircleDollarSign/>} title="Budget impact" tag="Over Budget" tone="red" detail="$150k over"/><StatusSignal icon={<Activity/>} title="Project pace" tag="On Pace" tone="green" detail="82% of planned"/><StatusSignal icon={<Users/>} title="Team capacity" tag="Over-Allocated" tone="yellow" detail="91% of planned"/></div>
      </div>
    </div>
    <div className="panel wide"><h2>Project details</h2><div className="project-detail-list"><DetailRow tone="red" title="Predicted Project End" detail="Significant risk of delay by around 29 days"/><DetailRow tone="yellow" title="Task Performance" detail="Tasks are taking significantly less/more time than estimated; validate estimates."/><DetailRow tone="red" title="Team Focus" detail="Team allocation is below planned focus on this project."/><DetailRow tone="green" title="Budget" detail="At project end, most fixed price budget will be used."/></div></div>
  </section>;
}

function StatusSignal({ icon, title, tag, tone, detail }: { icon: React.ReactNode; title: string; tag: string; tone: 'green' | 'yellow' | 'red'; detail: string }) {
  return <div className="status-signal"><div>{icon}<span>{title}</span><Pill tone={tone}>{tag}</Pill></div><strong>{detail}</strong></div>;
}

function DetailRow({ tone, title, detail }: { tone: 'green' | 'yellow' | 'red'; title: string; detail: string }) {
  return <div className={`detail-row ${tone}`}><AlertTriangle size={15}/><strong>{title}</strong><span>{detail}</span><button>See more</button></div>;
}

function ResourcePlanner() {
  return <section className="panel wide resource-panel">
    <div className="panel-head"><div><h2>Find Available Team Member</h2><p>Match people to projects by role, allocation, availability, and skill fit.</p></div><div className="resource-tools"><button><Search size={15}/></button><button>Filter (1)</button><button>Exclude Allocations</button><select className="mini-select"><option>Sort by Suitability</option></select><select className="mini-select"><option>Heatmap in Hours</option></select></div></div>
    <div className="capacity-table">
      <div className="capacity-sidebar"><strong>Filtering resources for:</strong><div className="role-badge"><Building2/> Consultant <Pill tone="blue">632h</Pill></div><span>Allocated People (0)</span><span>Filtered Matches (3)</span></div>
      <div className="capacity-grid">
        <div className="capacity-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span></div>
        <div className="project-allocation"><span>Website / Fixed price · 632h · 8h/day</span></div>
        {resources.map((resource) => <React.Fragment key={resource.name}>
          <div className="resource-person"><div className="avatar small">{resource.avatar}</div><div><strong>{resource.name}</strong><span>{resource.role}</span></div><button>Assign</button></div>
          <div className="resource-cells">{resource.months.map((month) => <div key={month.label} className={`capacity-cell ${month.status.toLowerCase()}`}><strong>{month.status === 'Available' ? month.hours : month.status}</strong><span>{month.status === 'Overallocated' ? month.hours : `${resource.match}% match`}</span></div>)}</div>
        </React.Fragment>)}
      </div>
    </div>
  </section>;
}

function CrmPipeline() {
  return <section className="content-grid">
    <div className="metrics-row"><MetricCard label="Accounts" value="4" helper="Customers, vendors, or internal clients" icon={<Building2/>}/><MetricCard label="Pipeline value" value="$55k" helper="Estimated project/work value" icon={<CircleDollarSign/>}/><MetricCard label="Open next actions" value="4" helper="Follow-ups tied to projects" icon={<MessageSquare/>}/><MetricCard label="Health signals" value="2" helper="Yellow accounts need attention" icon={<Gauge/>}/></div>
    <div className="panel wide"><div className="panel-head"><div><h2>CRM work pipeline</h2><p>Monday-style CRM layer for accounts, contacts, project workstreams, value, owner, stage, and next action.</p></div><button className="primary"><Plus/> New account</button></div><table><thead><tr><th>Account</th><th>Contact</th><th>Workstream</th><th>Stage</th><th>Value</th><th>Owner</th><th>Health</th><th>Next action</th></tr></thead><tbody>{crmRows.map((row) => <tr key={`${row.account}-${row.workstream}`}><td><strong>{row.account}</strong></td><td>{row.contact}</td><td>{row.workstream}</td><td><Pill tone="blue">{row.stage}</Pill></td><td>{row.value}</td><td>{userById(row.ownerId).name}</td><td><Pill tone={healthTone(row.health)}>{row.health}</Pill></td><td>{row.nextAction}</td></tr>)}</tbody></table></div>
    <div className="panel"><h2>CRM automations</h2><ul className="clean-list"><li><Mail/> Draft follow-up when a milestone slips.</li><li><MessageSquare/> Remind owner when no activity occurs for 7 days.</li><li><Briefcase/> Convert closed workstream into reusable project template.</li></ul></div>
    <div className="panel"><h2>Connected project attributes</h2><ul className="clean-list"><li><Link2/> Link account → project → milestone → task.</li><li><CircleDollarSign/> Track budget, estimate, and forecast variance.</li><li><Users/> Track client, vendor, owner, and contributor roles.</li></ul></div>
  </section>;
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
    <div className="relationship-node project-node"><strong>{project.name}</strong><span>{project.type} · {project.health} · owner {userById(project.ownerId).name}</span></div>
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
  const stats = statsForProject(project, tasks);
  return <section className="content-grid"><div className="panel wide"><h2>Executive status report</h2><div className="report-box">
    <h3>{project.name}</h3><p><strong>Health:</strong> {project.health}</p><p><strong>Progress:</strong> {stats.progress}% complete with {stats.blocked} blocked task(s).</p><p><strong>Current focus:</strong> Complete high-priority work, resolve linked issues, and prepare next milestone.</p><p><strong>Traceability:</strong> {project.phaseIds.length} phases, {project.milestoneIds.length} milestones, {tasks.length} tasks, {project.riskIds.length} risks, {project.issueIds.length} issues.</p>
  </div></div><div className="panel"><h2>Export options</h2><button className="big-action"><Download/> Export project JSON</button><button className="big-action"><Download/> Export task CSV</button><button className="big-action"><ClipboardList/> Generate status Markdown</button></div></section>;
}

function AdminConsole({ user, openAdmin }: { user: User; openAdmin: () => void }) {
  if (user.role !== 'Admin') return <section className="panel"><h2>Access denied</h2><p>Admin tools require the Admin role.</p></section>;
  return <section className="content-grid"><div className="metrics-row"><MetricCard label="Users" value={users.length} helper="Active demo accounts" icon={<Users/>}/><MetricCard label="Projects" value={projects.length} helper="All workspace projects" icon={<Boxes/>}/><MetricCard label="Repair tools" value="6" helper="Validation and recovery actions" icon={<Wrench/>}/><MetricCard label="Audit mode" value="On" helper="Activity and admin trail" icon={<LockKeyhole/>}/></div><div className="panel wide"><div className="panel-head"><div><h2>Admin console</h2><p>Manage users, project ownership, repair tools, archive/restore, and system exports.</p></div><button className="primary" onClick={openAdmin}><Settings/> Open tools</button></div><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td><Pill tone={item.role === 'Admin' ? 'red' : item.role === 'Power User' ? 'purple' : 'neutral'}>{item.role}</Pill></td><td>{projects.filter((project) => project.memberIds.includes(item.id)).length} projects</td></tr>)}</tbody></table></div></section>;
}

function TaskDrawer({ task, taskList, onClose }: { task: Task; taskList: Task[]; onClose: () => void }) {
  return <div><div className="drawer-head"><div><span className="eyebrow">Task drill-down</span><h2>{task.title}</h2></div><button onClick={onClose} aria-label="Close drill-down"><X size={16}/></button></div><p>{task.description}</p><div className="drawer-section"><h3>Smart references</h3><div className="ref-stack"><span><strong>WBS:</strong> {task.wbs}</span><span><strong>Phase:</strong> {phaseById(task.phaseId)?.name}</span><span><strong>Milestone:</strong> {milestoneById(task.milestoneId)?.name}</span><span><strong>Owner:</strong> {userById(task.ownerId).name}</span><span><strong>Dependencies:</strong> {task.dependencyIds.map((id) => taskList.find((t) => t.id === id)?.title).filter(Boolean).join(', ') || 'None'}</span></div></div><div className="drawer-section"><h3>Risks and issues</h3>{task.riskIds.map((id) => <Pill key={id} tone="yellow">Risk: {riskById(id)?.title}</Pill>)}{task.issueIds.map((id) => <Pill key={id} tone="red">Issue: {issueById(id)?.title}</Pill>)}{!task.riskIds.length && !task.issueIds.length && <p className="muted">No linked risks or issues.</p>}</div><div className="drawer-section"><h3>AI next action</h3><div className="assistant-note"><Sparkles/> Recommend confirming acceptance evidence, checking dependent work, and updating milestone forecast after this status change.</div></div><div className="drawer-section"><h3>Acceptance criteria</h3><ul>{task.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="drawer-section"><h3>Evidence</h3><p>{task.evidence.length ? task.evidence.join(', ') : 'No evidence attached yet.'}</p></div></div>;
}

function PhaseDrawer({ phaseId, onClose }: { phaseId: string; onClose: () => void }) {
  const phase = phaseById(phaseId);
  if (!phase) return null;
  return <div><div className="drawer-head"><div><span className="eyebrow">Phase drill-down</span><h2>{phase.name}</h2></div><button onClick={onClose} aria-label="Close drill-down"><X size={16}/></button></div><p>{phase.description}</p><div className="progress big"><span style={{ width: `${phase.progress}%` }}/></div><div className="drawer-section"><h3>Milestones</h3>{milestones.filter((milestone) => milestone.phaseId === phase.id).map((milestone) => <div className="activity" key={milestone.id}><strong>{milestone.name}</strong><span>{milestone.status} · due {milestone.dueDate}</span></div>)}</div></div>;
}

function AdminDrawer({ onClose }: { onClose: () => void }) {
  return <div><div className="drawer-head"><div><span className="eyebrow">Admin repair tools</span><h2>Project operations</h2></div><button onClick={onClose} aria-label="Close admin tools"><X size={16}/></button></div><div className="drawer-section"><button className="big-action"><Wrench/> Recalculate project health</button><button className="big-action"><Layers3/> Rebuild WBS numbering</button><button className="big-action"><Database/> Validate imported data</button><button className="big-action"><Archive/> Restore archived project</button></div><p className="muted">These are frontend-ready controls. v0.4 should connect them to real API actions and audit records.</p></div>;
}

function AiDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  return <div><div className="drawer-head"><div><span className="eyebrow">AI plan sidekick</span><h2>{project.name}</h2></div><button onClick={onClose} aria-label="Close AI sidekick"><X size={16}/></button></div><div className="drawer-section"><h3>Suggested actions</h3><button className="big-action"><TrendingUp/> Adjust timeline from forecast</button><button className="big-action"><Users/> Find available resource</button><button className="big-action"><ClipboardList/> Draft weekly status update</button><button className="big-action"><AlertTriangle/> Identify emerging risks</button></div><div className="assistant-note"><Sparkles/> v0.4 should connect this panel to a real backend and AI provider or local Ollama model.</div></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
