"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/stores/useTasks";
import { useUIStore } from "@/stores/useUIStore";
import {
  getOverdueCount,
  getViewTasks,
  type ActiveView,
} from "@/lib/utils/views";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TaskCard } from "@/components/features/TaskCard";
import {
  CalendarDays,
  Clock,
  LayoutList,
  Plus,
  MoreVertical,
  Hash,
} from "lucide-react";
import { Providers } from "@/components/providers";
import Fuse from "fuse.js";

export default function Home() {
  const { tasks, currentListId, fetchTasks, setCurrentListId, loading } =
    useTasks();
  const {
    activeView,
    showCompleted,
    searchQuery,
    setActiveView,
    setShowCompleted,
    setSearchQuery,
  } = useUIStore();
  const overdueCount = tasks.length > 0 ? getOverdueCount(tasks) : 0;

  const filteredTasks = useMemo(
    () => getViewTasks(tasks, activeView, showCompleted),
    [tasks, activeView, showCompleted]
  );

  const finalTasks = useMemo(() => {
    if (!searchQuery.trim()) return filteredTasks;
    const fuse = new Fuse(filteredTasks, {
      keys: ["name", "description", "labels.name"],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(searchQuery).map((result) => result.item);
  }, [filteredTasks, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <Providers>
      <div className="flex h-screen bg-background">
        <motion.aside
          layoutId="sidebar"
          className="hidden lg:flex lg:w-64 lg:min-w-[260px] border-r bg-card p-4 flex flex-col"
        >
          <div className="mb-6 p-3 border-b rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Overdue
              </span>
              <Badge
                variant="destructive"
                className={cn(
                  "text-xs sm:text-sm",
                  overdueCount > 0 && "animate-pulse"
                )}
              >
                {overdueCount}
              </Badge>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <button
              className={cn(
                "w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                activeView === "today"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveView("today")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Today
            </button>
            <button
              className={cn(
                "w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                activeView === "next7"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveView("next7")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Next 7 days
            </button>
            <button
              className={cn(
                "w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                activeView === "upcoming"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveView("upcoming")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Upcoming
            </button>
            <button
              className={cn(
                "w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                activeView === "all"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveView("all")}
            >
              <LayoutList className="mr-2 h-4 w-4" />
              All tasks
            </button>
          </nav>
        </motion.aside>
        <motion.main
          layoutId="main-content"
          className="flex-1 p-4 md:p-8 overflow-auto bg-background"
        >
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search tasks..."
              className="w-full p-4 border border-input rounded-xl bg-card shadow-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-muted-foreground placeholder:text-muted-foreground/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold capitalize tracking-tight">
              {activeView === "next7"
                ? "Next 7 days"
                : activeView.replace(/([A-Z])/g, " $1").trim()}
            </h1>
            <label className="flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer select-none">
              <Checkbox
                checked={showCompleted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShowCompleted(e.target.checked)
                }
              />
              <span className="text-sm font-medium">Show completed</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-32 bg-muted rounded-xl animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))
            ) : finalTasks.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <LayoutList className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No tasks</h3>
                <p className="text-sm">
                  {searchQuery
                    ? "No tasks match your search."
                    : "No tasks in this view."}
                </p>
              </div>
            ) : (
              <motion.div
                layoutId="tasks-list"
                className="space-y-4"
                layout
                initial={false}
                animate={{ transition: { staggerChildren: 0.05 } }}
              >
                {finalTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={`task-${task.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.main>
      </div>
    </Providers>
  );
}
