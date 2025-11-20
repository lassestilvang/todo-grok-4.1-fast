import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: any;
  className?: string;
}

const TaskCard = ({ task, className }: TaskCardProps) => {
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const priorityVariant =
    task.priority === "high"
      ? "destructive"
      : task.priority === "medium"
      ? "secondary"
      : "outline";
  const priorityLabel =
    (task.priority || "none").charAt(0).toUpperCase() +
    (task.priority || "none").slice(1);

  return (
    <motion.div
      className={cn(
        "group flex w-full cursor-pointer rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        isOverdue &&
          "border-destructive/70 ring-2 ring-destructive/50 shadow-lg animate-pulse",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-start gap-3 flex-1">
        <Checkbox checked={!!task.completed} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={priorityVariant as any}>{priorityLabel}</Badge>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary">
              {task.name}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap mb-4">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {task.dueDate && (
              <Badge variant="outline" className="text-xs">
                {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
            <div className="flex-1 min-w-[100px] h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${task.subtasksProgress || 0}%` }}
              />
            </div>
            {(task.labels || []).map((label: any, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className={`text-xs bg-[${label.color}] text-white`}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { TaskCard };
