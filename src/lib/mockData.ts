import { Task, Course, User } from '@/types';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Environmental Science',
    color: '#6366f1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'course-2',
    name: 'Mathematics',
    color: '#f59e0b',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'course-3',
    name: 'Computer Science',
    color: '#10b981',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'course-4',
    name: 'Literature',
    color: '#ec4899',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// Get today and various dates for mock data
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Read Chapter 5 - Climate Change',
    description: 'Focus on greenhouse gases and their effects on global temperature.',
    status: 'todo',
    priority: 'high',
    dueDate: formatDate(tomorrow),
    courseId: 'course-1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Complete Calculus Problem Set 3',
    description: 'Problems 1-20, focus on integration techniques.',
    status: 'doing',
    priority: 'high',
    dueDate: formatDate(today),
    courseId: 'course-2',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Build React Portfolio Component',
    description: 'Create a reusable card component for projects.',
    status: 'done',
    priority: 'medium',
    dueDate: formatDate(yesterday),
    courseId: 'course-3',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Write Essay on Shakespeare',
    description: 'Analyze themes in Hamlet, minimum 1500 words.',
    status: 'todo',
    priority: 'medium',
    dueDate: formatDate(nextWeek),
    courseId: 'course-4',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Review Database Concepts',
    description: 'Study SQL queries and normalization.',
    status: 'todo',
    priority: 'low',
    dueDate: formatDate(nextWeek),
    courseId: 'course-3',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Lab Report - Water Quality',
    description: 'Document findings from last week\'s experiment.',
    status: 'doing',
    priority: 'high',
    dueDate: formatDate(yesterday),
    courseId: 'course-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Practice Linear Algebra',
    description: 'Matrix operations and eigenvalues.',
    status: 'done',
    priority: 'medium',
    courseId: 'course-2',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'task-8',
    title: 'Read Poetry Collection',
    description: 'Romantic era poems for discussion.',
    status: 'todo',
    priority: 'low',
    courseId: 'course-4',
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },
];

// Mock user
export const mockUser: User = {
  id: 'user-1',
  email: 'student@example.com',
  fullName: 'Alex Student',
};

// Helper to generate new IDs
export { generateId };
