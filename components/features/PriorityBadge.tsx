import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";

interface PriorityBadgeProps {
  priority: Task["priority"];
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const variant =
    priority === "high"
      ? "destructive"
      : priority === "medium"
      ? "secondary"
      : "outline";
  const label =
    (priority || "none").charAt(0).toUpperCase() +
    (priority || "none").slice(1);
  return <Badge variant={variant}>{label}</Badge>;
};
export { PriorityBadge };
