import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskCard } from "@/components/features/TaskCard";
import { PriorityBadge } from "@/components/features/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

vi.mock("@/stores/useTasks");
vi.mock("@/stores/useUIStore");

describe("components", () => {
  it("TaskCard renders task name, priority, description, due date, overdue badge, progress, labels", () => {
    const mockTask = {
      id: 1,
      name: "Test Task",
      description: "Test description",
      priority: "high" as const,
      dueDate: "2025-11-18", // overdue
      subtasksProgress: 50,
      labels: [{ name: "urgent", color: "#ff0000" }],
      completed: 0,
    };

    const { asFragment } = render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("urgent")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    expect(asFragment()).toMatchSnapshot();
  });

  it("TaskCard no overdue no labels no description", () => {
    const mockTask = {
      id: 1,
      name: "Normal Task",
      priority: "low",
      completed: 0,
    };

    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Normal Task")).toBeInTheDocument();
    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
  });

  it("PriorityBadge renders different variants", () => {
    const priorities = ["high", "medium", "low", "none"] as const;

    priorities.forEach((priority) => {
      render(<PriorityBadge priority={priority} />);
      expect(
        screen.getByText(priority.charAt(0).toUpperCase() + priority.slice(1))
      ).toBeInTheDocument();
    });
  });

  it("UI Badge renders variants", () => {
    const { asFragment } = render(<Badge variant="destructive">Test</Badge>);
    expect(asFragment()).toMatchSnapshot();

    const { asFragment: secondary } = render(
      <Badge variant="secondary">Test</Badge>
    );
    expect(secondary()).toMatchSnapshot();
  });

  it("UI Checkbox renders checked unchecked", () => {
    render(<Checkbox checked={false} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    render(<Checkbox checked={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("Card and Progress snapshot", () => {
    const { asFragment } = render(
      <Card>
        <div>Test Card</div>
      </Card>
    );
    expect(asFragment()).toMatchSnapshot();

    const { asFragment } = render(<Progress value={50} className="w-full" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
