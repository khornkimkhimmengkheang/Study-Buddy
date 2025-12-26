export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string; // When task was moved to "doing"
  completedAt?: string; // When task was moved to "done"
  timeSpent?: number; // Total seconds spent on task
}

export interface Course {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export type FilterStatus = "all" | TaskStatus;
export type SortOption = "dueDate" | "priority" | "createdAt";
