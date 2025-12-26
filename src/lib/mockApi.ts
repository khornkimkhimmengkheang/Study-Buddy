import { Task, Course, User } from "@/types";
import { mockTasks, mockCourses, mockUser, generateId } from "./mockData";

const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let tasks = [...mockTasks];
let courses = [...mockCourses];
let currentUser: User | null = null;

export const authApi = {
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; error?: string }> {
    await delay(500);

    if (!email || !password) {
      return { user: null as any, error: "Email and password are required" };
    }

    if (password.length < 6) {
      return {
        user: null as any,
        error: "Password must be at least 6 characters",
      };
    }

    currentUser = { ...mockUser, email };
    localStorage.setItem("studyplanner_user", JSON.stringify(currentUser));
    return { user: currentUser };
  },

  async signUp(
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ user: User; error?: string; message?: string }> {
    await delay(500);

    if (!email || !password) {
      return { user: null as any, error: "Email and password are required" };
    }

    if (password.length < 6) {
      return {
        user: null as any,
        error: "Password must be at least 6 characters",
      };
    }

    if (!email.includes("@")) {
      return { user: null as any, error: "Please enter a valid email address" };
    }

    currentUser = {
      id: generateId(),
      email,
      fullName: fullName || email.split("@")[0],
    };
    localStorage.setItem("studyplanner_user", JSON.stringify(currentUser));
    return { user: currentUser };
  },

  async signOut(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem("studyplanner_user");
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem("studyplanner_user");
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  async resetPassword(
    email: string
  ): Promise<{ error?: string; message?: string }> {
    await delay(500);

    if (!email || !email.includes("@")) {
      return { error: "Please enter a valid email address" };
    }

    console.log(`[Mock] Password reset email would be sent to: ${email}`);
    return { message: "Check your email for a reset link." };
  },

  async updatePassword(
    newPassword: string
  ): Promise<{ error?: string; message?: string }> {
    await delay(500);

    if (!newPassword || newPassword.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    console.log("[Mock] Password would be updated");
    return { message: "Password changed." };
  },

  async updateProfile(updates: {
    email?: string;
    fullName?: string;
  }): Promise<{ user: User | null; error?: string; message?: string }> {
    await delay(500);

    if (!currentUser) {
      const stored = localStorage.getItem("studyplanner_user");
      if (stored) {
        currentUser = JSON.parse(stored);
      } else {
        return { user: null, error: "Not authenticated" };
      }
    }

    if (updates.email && !updates.email.includes("@")) {
      return { user: null, error: "Please enter a valid email address" };
    }

    if (updates.email) {
      currentUser = { ...currentUser!, email: updates.email };
    }
    if (updates.fullName !== undefined) {
      currentUser = { ...currentUser!, fullName: updates.fullName };
    }

    localStorage.setItem("studyplanner_user", JSON.stringify(currentUser));

    return {
      user: currentUser,
      message: updates.email
        ? "Please check your new email to confirm the change."
        : "Profile updated successfully.",
    };
  },

  async resendConfirmation(
    email: string
  ): Promise<{ error?: string; message?: string }> {
    await delay(500);

    if (!email || !email.includes("@")) {
      return { error: "Please enter a valid email address" };
    }

    console.log(`[Mock] Confirmation email would be resent to: ${email}`);
    return { message: "Confirmation email sent. Please check your inbox." };
  },
};

export const tasksApi = {
  async getAll(): Promise<Task[]> {
    await delay();
    return [...tasks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async create(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    await delay();
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    tasks = [newTask, ...tasks];
    return newTask;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    await delay();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return tasks[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    tasks = tasks.filter((t) => t.id !== id);
  },

  async updateStatus(id: string, status: Task["status"]): Promise<Task> {
    await delay();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const currentTask = tasks[index];
    const now = new Date().toISOString();
    const updates: Partial<Task> = { status, updatedAt: now };

    if (status === "doing") {
      updates.startedAt = now;
    }

    if (status === "done" && currentTask.startedAt) {
      const startTime = new Date(currentTask.startedAt).getTime();
      const endTime = Date.now();
      const sessionTime = Math.floor((endTime - startTime) / 1000);
      const previousTime = currentTask.timeSpent || 0;

      updates.timeSpent = previousTime + sessionTime;
      updates.completedAt = now;
      updates.startedAt = undefined;
    }

    if (status === "todo") {
      updates.startedAt = undefined;
    }

    const updatedTask = { ...currentTask, ...updates };
    tasks[index] = updatedTask;
    return updatedTask;
  },
};

export const coursesApi = {
  async getAll(): Promise<Course[]> {
    await delay();
    return [...courses];
  },

  async create(courseData: Omit<Course, "id" | "createdAt">): Promise<Course> {
    await delay();
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    courses = [...courses, newCourse];
    return newCourse;
  },

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    await delay();
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Course not found");

    courses[index] = { ...courses[index], ...updates };
    return courses[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    courses = courses.filter((c) => c.id !== id);
    tasks = tasks.map((t) =>
      t.courseId === id ? { ...t, courseId: undefined } : t
    );
  },
};
