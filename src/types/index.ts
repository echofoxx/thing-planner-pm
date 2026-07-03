export type Role = 'Admin' | 'Power User' | 'Member' | 'Viewer';
export type ProjectType = 'Software' | 'Home' | 'Auto' | 'Office' | 'Standards' | 'Event';
export type Status = 'Backlog' | 'Ready' | 'In Progress' | 'Review' | 'Blocked' | 'Done';
export type Health = 'Green' | 'Yellow' | 'Red' | 'Gray';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  status: Status;
  progress: number;
  milestoneIds: string[];
  description: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  dueDate: string;
  status: Status;
  taskIds: string[];
}

export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  milestoneId: string;
  wbs: string;
  title: string;
  description: string;
  ownerId: string;
  status: Status;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  dependencyIds: string[];
  riskIds: string[];
  issueIds: string[];
  acceptanceCriteria: string[];
  evidence: string[];
}

export interface RiskIssue {
  id: string;
  projectId: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Mitigating' | 'Closed';
  linkedTaskIds: string[];
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  ownerId: string;
  memberIds: string[];
  health: Health;
  status: 'Active' | 'Archived' | 'Completed';
  goal: string;
  startDate: string;
  targetDate: string;
  budget?: number;
  phaseIds: string[];
  milestoneIds: string[];
  taskIds: string[];
  riskIds: string[];
  issueIds: string[];
  lessons: string[];
}

export interface ActivityEvent {
  id: string;
  projectId: string;
  actorId: string;
  message: string;
  timestamp: string;
}
