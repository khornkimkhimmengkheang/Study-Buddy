import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useCourses } from "@/hooks/useCourses";
import { useSettings } from "@/hooks/useSettings";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import { CourseList } from "@/components/CourseList";
import { FilterBar } from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { TaskListSkeleton } from "@/components/TaskSkeleton";
import { SettingsDialog } from "@/components/SettingsDialog";
import {
  Plus,
  Menu,
  BookOpen,
  User,
  LogOut,
  Loader2,
  Settings,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { settings } = useSettings();
  const {
    tasks,
    allTasks,
    isLoading: tasksLoading,
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
  } = useTasks();
  const { courses, createCourse, updateCourse, deleteCourse, getCourseById } =
    useCourses();

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const taskCountByCourse = useMemo(() => {
    return allTasks.reduce((acc, task) => {
      if (task.courseId) {
        acc[task.courseId] = (acc[task.courseId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [allTasks]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    navigate("/");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleTaskSubmit = async (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    setEditingTask(null);
  };

  const handleCreateCourse = async (name: string) => {
    await createCourse(name);
  };

  const handleUpdateCourse = async (id: string, name: string) => {
    await updateCourse(id, { name });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">StudyPlanner</span>
      </div>

      <Separator className="flex-shrink-0" />

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 py-4">
          <CourseList
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={(id) => {
              setSelectedCourseId(id);
              setIsMobileSidebarOpen(false);
            }}
            onCreateCourse={handleCreateCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={deleteCourse}
            taskCountByCourse={taskCountByCourse}
          />
        </div>
      </ScrollArea>

      <Separator className="flex-shrink-0" />

      <div className="flex-shrink-0 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-10">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="flex-1 text-left truncate text-sm">
                {user?.fullName || user?.email || "Demo User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {settings.displayName || user?.fullName || "Demo User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "demo@studyplanner.app"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-dvh flex bg-background overflow-hidden">
      <aside className="hidden lg:flex w-64 flex-col border-r gradient-sidebar flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="flex-shrink-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Sheet
                open={isMobileSidebarOpen}
                onOpenChange={setIsMobileSidebarOpen}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open menu</p>
                  </TooltipContent>
                </Tooltip>
                <SheetContent side="left" className="p-0 w-72 h-full">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {selectedCourseId
                    ? getCourseById(selectedCourseId)?.name || "Tasks"
                    : "All Tasks"}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {taskCounts.all} total • {taskCounts.done} completed
                </p>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <div className="max-w-3xl mx-auto space-y-6 pb-6">
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              taskCounts={taskCounts}
            />

            {tasksLoading ? (
              <TaskListSkeleton />
            ) : tasks.length === 0 ? (
              <EmptyState
                title={
                  searchQuery || filter !== "all"
                    ? "No tasks found"
                    : "No tasks yet"
                }
                description={
                  searchQuery || filter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first task to start organizing your studies"
                }
                actionLabel={
                  !searchQuery && filter === "all" ? "Add Task" : undefined
                }
                onAction={() => {
                  setEditingTask(null);
                  setIsTaskDialogOpen(true);
                }}
              />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    course={
                      task.courseId ? getCourseById(task.courseId) : undefined
                    }
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={updateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <TaskFormDialog
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        courses={courses}
        onSubmit={handleTaskSubmit}
      />

      <DeleteTaskDialog
        task={deletingTask}
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        allTasks={allTasks}
        deleteAllTasks={deleteAllTasks}
      />
    </div>
  );
}
