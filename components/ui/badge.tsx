import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = ({ variant }: { variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  if (variant === "secondary") return cn(base, "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80")
  if (variant === "destructive") return cn(base, "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80")
  if (variant === "outline") return cn(base, "text-foreground")
  return cn(base, "border-transparent bg-primary text-primary-foreground hover:bg-primary/80")
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
