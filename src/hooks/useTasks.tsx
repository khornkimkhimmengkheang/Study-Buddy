import { useState, useEffect, useCallback } from "react";
import { Task, FilterStatus, SortOption, TaskStatus } from "@/types";
import { tasksApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function getInitialSort(): SortOption {
  try {
    const stored = localStorage.getItem("study-planner-settings");
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.defaultSortBy || "dueDate";
    }
  } catch {}
  return "dueDate";
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>(getInitialSort);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTask = await tasksApi.create(taskData);
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: "Task created",
        description: "Your task has been added successfully.",
      });
      return newTask;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updated = await tasksApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast({
        title: "Task updated",
        description: "Changes saved successfully.",
      });
      return updated;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Task deleted",
        description: "Task has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAllTasks = async () => {
    try {
      for (const task of tasks) {
        await tasksApi.delete(task.id);
      }
      setTasks([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all tasks",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStatus = async (id: string, status: TaskStatus) => {
    try {
      const updated = await tasksApi.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      const statusMessages = {
        todo: "Moved to Todo",
        doing: "Started working on it",
        done: "Marked as complete! 🎉",
      };

      toast({
        title: statusMessages[status],
        description: updated.title,
      });
      return updated;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter !== "all" && task.status !== filter) return false;

      if (selectedCourseId && task.courseId !== selectedCourseId) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const tasksForCounts = selectedCourseId
    ? tasks.filter((t) => t.courseId === selectedCourseId)
    : tasks;

  const taskCounts = {
    all: tasksForCounts.length,
    todo: tasksForCounts.filter((t) => t.status === "todo").length,
    doing: tasksForCounts.filter((t) => t.status === "doing").length,
    done: tasksForCounts.filter((t) => t.status === "done").length,
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    isLoading,
    taskCounts,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    selectedCourseId,
    setSelectedCourseId,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    updateStatus,
    refetch: fetchTasks,
  };
}
