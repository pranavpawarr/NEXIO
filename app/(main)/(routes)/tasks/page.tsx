"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  MapPin,
  Loader2,
  FileText,
  Plus,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  CalendarPlus,
  CalendarCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  content: string;
  isDone: boolean;
  priority: string;
  documentId: string;
  calendarEventId?: string | null;
  document?: { title: string };
  createdAt: string;
}

export default function TasksPage() {
  const queryClient = useQueryClient();

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [sortType, setSortType] = useState<"date" | "priority">("date");
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");

  // 1. Fetch All Tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["all-tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  useEffect(() => {
    if (tasks) {
      sortTasks(tasks, sortType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const sortTasks = (taskList: Task[], type: "date" | "priority") => {
    const sorted = [...taskList].sort((a, b) => {
      if (type === "priority") {
        const priorityMap: Record<string, number> = {
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setLocalTasks(sorted);
  };

  const handleSortChange = () => {
    const newType = sortType === "date" ? "priority" : "date";
    setSortType(newType);
    sortTasks(localTasks, newType);
    toast.info(`Sorted by ${newType}`);
  };

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          content: newTaskContent,
          priority: newTaskPriority,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      toast.success("Task added to Inbox");
      setIsCreateOpen(false);
      setNewTaskContent("");
      setNewTaskPriority("MEDIUM");
    },
    onError: () => toast.error("Failed to create task"),
  });

  const reorderMutation = useMutation({
    mutationFn: async (payload: {
      tasks: Task[];
      lat: number;
      lng: number;
    }) => {
      const res = await fetch("/api/tasks/reorder", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (sorted) => {
      setLocalTasks(sorted);
      toast.success("Sorted by location!");
    },
    onError: () => toast.error("Failed to sort"),
  });

  const handleGeoSort = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setIsLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocLoading(false);
        const pendingTasks = localTasks.filter((t) => !t.isDone);
        reorderMutation.mutate({
          tasks: pendingTasks,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setIsLocLoading(false);
        toast.error("Could not retrieve location.");
      }
    );
  };

  const calendarMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/calendar`, {
        method: "POST",
      });

      if (!res.ok) {
        // 1. Check if the response is HTML (Error Page) instead of Text/JSON
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("API Route not found (Check file structure)");
        }

        const text = await res.text();
        throw new Error(text || "Failed to sync");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Added to Google Calendar!");
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    },
    onError: (err) => toast.error(err.message),
  });

  // Toggle Task - Updates Local State Instantly
  const toggleTask = useMutation({
    mutationFn: async (task: Task) => {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDone: !task.isDone }),
      });
    },
    onSuccess: (_, variables) => {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === variables.id ? { ...t, isDone: !t.isDone } : t
        )
      );
      toast.success(variables.isDone ? "Task active" : "Task completed");
    },
  });

  // Filter lists
  const pendingTasks = localTasks.filter((t) => !t.isDone);
  const completedTasks = localTasks.filter((t) => t.isDone);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-[200px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full p-8 overflow-y-auto bg-white dark:bg-[#1F1F1F]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          My Tasks
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSortChange}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortType === "priority" ? "Priority" : "Newest"}
          </Button>

          <Button
            onClick={handleGeoSort}
            disabled={isLocLoading || reorderMutation.isPending}
            variant="outline"
            size="sm"
          >
            {isLocLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Location
          </Button>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="What needs to be done?"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                />
                <Select
                  value={newTaskPriority}
                  onValueChange={setNewTaskPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High Priority</SelectItem>
                    <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                    <SelectItem value="LOW">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={() => createTaskMutation.mutate()}
                  disabled={!newTaskContent || createTaskMutation.isPending}
                >
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* PENDING TASKS */}
        <div className="space-y-3">
          {pendingTasks.length === 0 && completedTasks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No tasks found.</p>
            </div>
          )}

          {pendingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask.mutate(task)}
              onAddToCalendar={() => calendarMutation.mutate(task.id)}
              isCalendarPending={calendarMutation.isPending}
            />
          ))}
        </div>

        {/* COMPLETED TASKS SECTION */}
        {completedTasks.length > 0 && (
          <div className="pt-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition mb-3"
            >
              {showCompleted ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Completed ({completedTasks.length})
            </button>

            {showCompleted && (
              <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask.mutate(task)}
                    onAddToCalendar={() => calendarMutation.mutate(task.id)}
                    isCalendarPending={calendarMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Updated TaskItem Component
function TaskItem({
  task,
  onToggle,
  onAddToCalendar,
  isCalendarPending,
}: {
  task: Task;
  onToggle: () => void;
  onAddToCalendar: () => void;
  isCalendarPending: boolean;
}) {
  return (
    <div className="group flex items-center p-4 border rounded-lg bg-card hover:shadow-md transition">
      <button onClick={onToggle} className="mr-4">
        {task.isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-green-500 transition" />
        )}
      </button>

      <div className="flex-1">
        <p
          className={cn(
            "font-medium text-sm",
            task.isDone && "line-through text-muted-foreground"
          )}
        >
          {task.content}
        </p>
        <div className="flex items-center gap-x-2 mt-1.5">
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase",
              task.priority === "HIGH" &&
                "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30",
              task.priority === "MEDIUM" &&
                "bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30",
              task.priority === "LOW" &&
                "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30"
            )}
          >
            {task.priority}
          </span>

          {task.document && (
            <Link
              href={`/documents/${task.documentId}`}
              className="flex items-center text-xs text-muted-foreground hover:text-primary transition"
            >
              <FileText className="h-3 w-3 mr-1" />
              {task.document.title || "Untitled"}
            </Link>
          )}
        </div>
      </div>

      {/* GOOGLE CALENDAR BUTTON */}
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition h-8 w-8 ml-2"
        onClick={onAddToCalendar}
        disabled={!!task.calendarEventId || isCalendarPending}
        title={
          task.calendarEventId
            ? "Already in Google Calendar"
            : "Add to Google Calendar"
        }
      >
        {task.calendarEventId ? (
          <CalendarCheck className="h-4 w-4 text-green-600" />
        ) : (
          <CalendarPlus className="h-4 w-4 text-muted-foreground hover:text-blue-600 transition" />
        )}
      </Button>
    </div>
  );
}
