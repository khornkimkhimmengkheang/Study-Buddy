import React, { useState, useEffect } from "react";
import { useSettings, ColorTheme } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { Task } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  User,
  Palette,
  ListTodo,
  Calendar,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Check,
  Shield,
  Loader2,
} from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allTasks: Task[];
  deleteAllTasks: () => Promise<void>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  allTasks,
  deleteAllTasks,
}: SettingsDialogProps) {
  const { user, updatePassword, updateProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [displayName, setDisplayName] = useState(
    settings.displayName || user?.fullName || ""
  );

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(settings.displayName || user?.fullName || "");
      setShowPasswordChange(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }
  }, [open, settings.displayName, user?.fullName]);

  const handleSaveDisplayName = async () => {
    updateSettings({ displayName });

    if (user) {
      setProfileLoading(true);
      try {
        const result = await updateProfile({ fullName: displayName });
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Display name updated");
        }
      } catch (err) {
        toast.success("Display name updated locally");
      } finally {
        setProfileLoading(false);
      }
    } else {
      toast.success("Display name updated");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.error) {
        setPasswordError(result.error);
      } else {
        toast.success("Password updated successfully");
        setShowPasswordChange(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportTasks = () => {
    if (allTasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }

    const headers = [
      "Title",
      "Description",
      "Status",
      "Priority",
      "Due Date",
      "Course ID",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...allTasks.map((task) =>
        [
          `"${task.title.replace(/"/g, '""')}"`,
          `"${(task.description || "").replace(/"/g, '""')}"`,
          task.status,
          task.priority,
          task.dueDate || "",
          task.courseId || "",
          task.createdAt,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `study-planner-tasks-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Tasks exported successfully");
  };

  const handleDeleteAllTasks = async () => {
    await deleteAllTasks();
    setDeleteConfirmOpen(false);
    toast.success("All tasks deleted");
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const colorThemes: { id: ColorTheme; name: string; preview: string }[] = [
    {
      id: "violet",
      name: "Violet",
      preview: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
    },
    {
      id: "ocean",
      name: "Ocean",
      preview: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    },
    {
      id: "forest",
      name: "Forest",
      preview: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
    },
    {
      id: "sunset",
      name: "Sunset",
      preview: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    },
    {
      id: "rose",
      name: "Rose",
      preview: "linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)",
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0">
            <DialogTitle className="text-xl">Settings</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[60vh] sm:max-h-[65vh]">
            <div className="px-6 pb-6 space-y-6">
              {/* Account Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Account
                </div>

                <div className="space-y-3 pl-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm">
                      {user?.email || "demo@studyplanner.app"}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter display name"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveDisplayName}
                        disabled={
                          profileLoading ||
                          displayName ===
                            (settings.displayName || user?.fullName || "")
                        }
                      >
                        {profileLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Security Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Security
                </div>

                <div className="space-y-3 pl-6">
                  {!showPasswordChange ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowPasswordChange(true)}
                    >
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
                      <div className="space-y-1.5">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                        />
                        <p className="text-xs text-muted-foreground">
                          Must be at least 6 characters
                        </p>
                      </div>

                      {passwordError && (
                        <p className="text-sm text-destructive">
                          {passwordError}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setNewPassword("");
                            setConfirmPassword("");
                            setPasswordError("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={handlePasswordChange}
                          disabled={
                            passwordLoading || !newPassword || !confirmPassword
                          }
                        >
                          {passwordLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <Separator />

              {/* Appearance Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  Appearance
                </div>

                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <div className="flex gap-2">
                      {(["light", "dark", "system"] as const).map((theme) => {
                        const Icon = themeIcons[theme];
                        return (
                          <Button
                            key={theme}
                            variant={
                              settings.theme === theme ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => updateSettings({ theme })}
                            className="flex-1 gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="capitalize">{theme}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() =>
                            updateSettings({ colorTheme: theme.id })
                          }
                          className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                            settings.colorTheme === theme.id
                              ? "border-primary bg-primary/5"
                              : "border-transparent bg-muted/50 hover:bg-muted"
                          }`}
                          title={theme.name}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-sm"
                            style={{ background: theme.preview }}
                          />
                          <span className="text-[10px] font-medium truncate w-full text-center">
                            {theme.name}
                          </span>
                          {settings.colorTheme === theme.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compactMode">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Tighter spacing for task list
                      </p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={settings.compactMode}
                      onCheckedChange={(checked) =>
                        updateSettings({ compactMode: checked })
                      }
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Task Defaults Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ListTodo className="h-4 w-4" />
                  Task Defaults
                </div>

                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Default Priority</Label>
                      <Select
                        value={settings.defaultPriority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          updateSettings({ defaultPriority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Default Status</Label>
                      <Select
                        value={settings.defaultStatus}
                        onValueChange={(value: "todo" | "doing") =>
                          updateSettings({ defaultStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="doing">Doing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Default Sort Order</Label>
                    <Select
                      value={settings.defaultSortBy}
                      onValueChange={(
                        value: "dueDate" | "priority" | "createdAt"
                      ) => updateSettings({ defaultSortBy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Preferences Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Preferences
                </div>

                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Week Starts On</Label>
                      <Select
                        value={settings.weekStartsOn}
                        onValueChange={(value: "monday" | "sunday") =>
                          updateSettings({ weekStartsOn: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Date Format</Label>
                      <Select
                        value={settings.dateFormat}
                        onValueChange={(value: "DD/MM/YYYY" | "MM/DD/YYYY") =>
                          updateSettings({ dateFormat: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Data Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Download className="h-4 w-4" />
                  Data
                </div>

                <div className="space-y-3 pl-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleExportTasks}
                  >
                    <Download className="h-4 w-4" />
                    Export Tasks (CSV)
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete All Tasks
                  </Button>
                </div>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {allTasks.length} tasks. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllTasks}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
