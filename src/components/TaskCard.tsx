import { useState, useEffect } from "react";
import { Task, Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Timer,
} from "lucide-react";
import { format, isToday, isPast, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  course?: Course;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const priorityConfig = {
  high: {
    label: "High",
    className: "bg-priority-high/10 text-priority-high border-priority-high/20",
  },
  medium: {
    label: "Medium",
    className:
      "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
  },
  low: {
    label: "Low",
    className: "bg-priority-low/10 text-priority-low border-priority-low/20",
  },
};

const statusConfig = {
  todo: { label: "To Do", icon: Circle, className: "text-status-todo" },
  doing: { label: "In Progress", icon: Clock, className: "text-status-doing" },
  done: { label: "Done", icon: CheckCircle2, className: "text-status-done" },
};

export function TaskCard({
  task,
  course,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const StatusIcon = statusConfig[task.status].icon;
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (task.status === "doing" && task.startedAt) {
      const startTime = new Date(task.startedAt).getTime();
      const previousTime = task.timeSpent || 0;

      const updateElapsed = () => {
        const now = Date.now();
        const currentSession = Math.floor((now - startTime) / 1000);
        setElapsedTime(previousTime + currentSession);
      };

      updateElapsed();
      const interval = setInterval(updateElapsed, 1000);
      return () => clearInterval(interval);
    } else if (task.status === "done" && task.timeSpent) {
      setElapsedTime(task.timeSpent);
    } else {
      setElapsedTime(task.timeSpent || 0);
    }
  }, [task.status, task.startedAt, task.timeSpent]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const isOverdue =
      isPast(dueDate) && !isToday(dueDate) && task.status !== "done";
    const isDueToday = isToday(dueDate);
    const isDueTomorrow = isTomorrow(dueDate);

    let label = format(dueDate, "MMM d");
    let className = "text-muted-foreground";

    if (isOverdue) {
      label = "Overdue";
      className = "text-destructive";
    } else if (isDueToday) {
      label = "Today";
      className = "text-warning";
    } else if (isDueTomorrow) {
      label = "Tomorrow";
      className = "text-primary";
    }

    return { label, className, isOverdue };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <Card
      className={cn(
        "task-card p-4 transition-all duration-200 hover:shadow-card-hover group animate-fade-in",
        task.status === "done" && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status button with label */}
        <button
          onClick={() => {
            const nextStatus =
              task.status === "todo"
                ? "doing"
                : task.status === "doing"
                ? "done"
                : "todo";
            onStatusChange(task.id, nextStatus);
          }}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-accent",
            statusConfig[task.status].className
          )}
        >
          <StatusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">
            {statusConfig[task.status].label}
          </span>
        </button>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "task-title font-medium text-foreground leading-tight",
                task.status === "done" && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>

            {/* Action buttons - visible on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(task)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(task)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Delete</span>
              </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="task-meta flex flex-wrap items-center gap-2 mt-3">
            {course && (
              <Badge
                variant="outline"
                className="text-xs font-normal"
                style={{
                  borderColor: course.color + "40",
                  backgroundColor: course.color + "10",
                  color: course.color,
                }}
              >
                {course.name}
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "text-xs font-normal",
                priorityConfig[task.priority].className
              )}
            >
              {priorityConfig[task.priority].label}
            </Badge>

            {dueDateInfo && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  dueDateInfo.className
                )}
              >
                {dueDateInfo.isOverdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                {dueDateInfo.label}
              </span>
            )}

            {/* Time tracker display */}
            {(task.status === "doing" ||
              (task.status === "done" && task.timeSpent)) && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  task.status === "doing"
                    ? "text-primary animate-pulse"
                    : "text-success"
                )}
              >
                <Timer className="h-3 w-3" />
                {formatElapsedTime(elapsedTime)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
