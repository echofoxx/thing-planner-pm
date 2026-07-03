import { activity, issues, milestones, phases, projects, risks, tasks, users } from '../data/demo';
import type { Project, Status, Task, User } from '../types';

export const statuses: Status[] = ['Backlog', 'Ready', 'In Progress', 'Review', 'Blocked', 'Done'];

export function userById(id: string): User {
  return users.find((user) => user.id === id) ?? users[0];
}

export function tasksForProject(projectId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId);
}

export function phaseById(id: string) {
  return phases.find((phase) => phase.id === id);
}

export function milestoneById(id: string) {
  return milestones.find((milestone) => milestone.id === id);
}

export function riskById(id: string) {
  return risks.find((risk) => risk.id === id);
}

export function issueById(id: string) {
  return issues.find((issue) => issue.id === id);
}

export function calculateProgress(project: Project): number {
  const projectTasks = tasksForProject(project.id);
  if (!projectTasks.length) return 0;
  const done = projectTasks.filter((task) => task.status === 'Done').length;
  return Math.round((done / projectTasks.length) * 100);
}

export function visibleProjects(user: User): Project[] {
  if (user.role === 'Admin') return projects;
  return projects.filter((project) => project.memberIds.includes(user.id) || project.ownerId === user.id);
}

export function projectStats(project: Project) {
  const projectTasks = tasksForProject(project.id);
  return {
    total: projectTasks.length,
    done: projectTasks.filter((task) => task.status === 'Done').length,
    blocked: projectTasks.filter((task) => task.status === 'Blocked').length,
    overdue: projectTasks.filter((task) => task.status !== 'Done' && new Date(task.dueDate) < new Date('2026-07-03')).length,
    highPriority: projectTasks.filter((task) => task.priority === 'High' || task.priority === 'Critical').length,
    progress: calculateProgress(project)
  };
}

export function projectActivity(projectId: string) {
  return activity.filter((event) => event.projectId === projectId);
}
