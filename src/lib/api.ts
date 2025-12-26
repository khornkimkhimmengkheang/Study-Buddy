import { supabase, isSupabaseConfigured } from "./supabase";
import { Task, Course, User } from "@/types";
import * as mockApi from "./mockApi";

export const authApi = {
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.signIn(email, password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "Sign in failed" };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name,
      },
    };
  },

  async signUp(
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ user: User | null; error?: string; message?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.signUp(email, password, fullName);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth?confirmed=true`,
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "Sign up failed" };
    }

    if (data.user.identities?.length === 0) {
      return {
        user: null,
        error: "This email is already registered. Please sign in instead.",
      };
    }

    const needsConfirmation = !data.session;

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: fullName,
      },
      message: needsConfirmation
        ? "Please check your email to confirm your account."
        : undefined,
    };
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.signOut();
    }

    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.getCurrentUser();
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
    };
  },

  async resetPassword(
    email: string
  ): Promise<{ error?: string; message?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.resetPassword(email);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { message: "Check your email for a reset link." };
  },

  async updatePassword(
    newPassword: string
  ): Promise<{ error?: string; message?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.updatePassword(newPassword);
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { message: "Password changed." };
  },

  async updateProfile(updates: {
    email?: string;
    fullName?: string;
  }): Promise<{ user: User | null; error?: string; message?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.updateProfile(updates);
    }

    const updateData: { email?: string; data?: { full_name?: string } } = {};

    if (updates.email) {
      updateData.email = updates.email;
    }

    if (updates.fullName !== undefined) {
      updateData.data = { full_name: updates.fullName };
    }

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: "Profile update failed" };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name,
      },
      message: updates.email
        ? "Check your new email to confirm."
        : "Profile saved.",
    };
  },

  async resendConfirmation(
    email: string
  ): Promise<{ error?: string; message?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.authApi.resendConfirmation(email);
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { message: "Confirmation email sent. Please check your inbox." };
  },

  onAuthStateChange(callback: (user: User | null, event?: string) => void) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback(
          {
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata?.full_name,
          },
          event
        );
      } else {
        callback(null, event);
      }
    });
  },

  async handleAuthCallback(): Promise<{
    type: "recovery" | "signup" | "email_change" | null;
    error?: string;
  }> {
    if (!isSupabaseConfigured || !supabase) {
      return { type: null };
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      return { type: null };
    }

    const { error } = await supabase.auth.getSession();

    if (error) {
      return { type: null, error: error.message };
    }

    if (type === "recovery") {
      return { type: "recovery" };
    } else if (type === "signup") {
      return { type: "signup" };
    } else if (type === "email_change") {
      return { type: "email_change" };
    }

    return { type: null };
  },
};

export const tasksApi = {
  async getAll(): Promise<Task[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.tasksApi.getAll();
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(mapTaskFromDb);
  },

  async create(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.tasksApi.create(taskData);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.dueDate,
        course_id: taskData.courseId,
      })
      .select()
      .single();

    if (error) throw error;

    return mapTaskFromDb(data);
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.tasksApi.update(id, updates);
    }

    const updateData: Record<string, any> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.courseId !== undefined) updateData.course_id = updates.courseId;

    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapTaskFromDb(data);
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.tasksApi.delete(id);
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  },

  async updateStatus(id: string, status: Task["status"]): Promise<Task> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.tasksApi.updateStatus(id, status);
    }

    const { data: currentTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const now = new Date().toISOString();
    const updates: Record<string, any> = { status };

    if (status === "doing") {
      updates.started_at = now;
    }

    if (status === "done" && currentTask.started_at) {
      const startTime = new Date(currentTask.started_at).getTime();
      const endTime = Date.now();
      const sessionTime = Math.floor((endTime - startTime) / 1000);
      const previousTime = currentTask.time_spent || 0;

      updates.time_spent = previousTime + sessionTime;
      updates.completed_at = now;
      updates.started_at = null;
    }

    if (status === "todo") {
      updates.started_at = null;
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapTaskFromDb(data);
  },

  async deleteAll(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  },
};

export const coursesApi = {
  async getAll(): Promise<Course[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.coursesApi.getAll();
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map(mapCourseFromDb);
  },

  async create(courseData: Omit<Course, "id" | "createdAt">): Promise<Course> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.coursesApi.create(courseData);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("courses")
      .insert({
        user_id: user.id,
        name: courseData.name,
        color: courseData.color,
      })
      .select()
      .single();

    if (error) throw error;

    return mapCourseFromDb(data);
  },

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.coursesApi.update(id, updates);
    }

    const updateData: Record<string, any> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;

    const { data, error } = await supabase
      .from("courses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapCourseFromDb(data);
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      return mockApi.coursesApi.delete(id);
    }

    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) throw error;
  },
};

function mapTaskFromDb(dbTask: any): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status,
    priority: dbTask.priority,
    dueDate: dbTask.due_date,
    courseId: dbTask.course_id,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
    startedAt: dbTask.started_at,
    completedAt: dbTask.completed_at,
    timeSpent: dbTask.time_spent,
  };
}

function mapCourseFromDb(dbCourse: any): Course {
  return {
    id: dbCourse.id,
    name: dbCourse.name,
    color: dbCourse.color,
    createdAt: dbCourse.created_at,
  };
}
