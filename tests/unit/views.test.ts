import { describe, it, expect } from "vitest";
import type { Task } from "@/types";
import { getTodayTasks, getNext7Tasks, getUpcomingTasks, getAllTasks, getViewTasks, getOverdueCount } from "@/lib/utils/views";
import { startOfDay, addDays, subDays } from "date-fns";

const now = new Date("2024-01-15");
const todayStr = startOfDay(now).toISOString();
const overdueStr = subDays(now, 2).toISOString();
const next1Str = addDays(now, 1).toISOString();
const next7Str = addDays(now, 7).toISOString();
const upcomingStr = addDays(now, 8).toISOString();

const mockTasks: Task[] = [
  { id: 1, listId: 1, name: "Overdue", description: null, scheduledDate: null, dueDate: overdueStr, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
  { id: 2, listId: 1, name: "Today", description: null, scheduledDate: null, dueDate: todayStr, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
  { id: 3, listId: 1, name: "Next1", description: null, scheduledDate: null, dueDate: next1Str, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
  { id: 4, listId: 1, name: "Next7", description: null, scheduledDate: null, dueDate: next7Str, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
  { id: 5, listId: 1, name: "Upcoming", description: null, scheduledDate: null, dueDate: upcomingStr, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
  { id: 6, listId: 1, name: "Today completed", description: null, scheduledDate: null, dueDate: todayStr, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 1 },
  { id: 7, listId: 1, name: "No due", description: null, scheduledDate: null, dueDate: null, estimateDuration: null, actualDuration: null, priority: "low" as const, recurringType: null, completed: 0 },
];

describe("views filters", () => {
  it("getOverdueCount returns correct count", () => {
    expect(getOverdueCount(mockTasks)).toBe(1);
  });

  it("getTodayTasks filters correctly", () => {
    expect(getTodayTasks(mockTasks, false).length).toBe(1);
    expect(getTodayTasks(mockTasks, true).length).toBe(2);
  });

  it("getNext7Tasks filters correctly (includes today to +7)", () => {
    expect(getNext7Tasks(mockTasks, false).length).toBe(4); // today, next1, next7, no due? No due skipped
  });

  it("getUpcomingTasks filters correctly", () => {
    expect(getUpcomingTasks(mockTasks, false).length).toBe(1);
  });

  it("getAllTasks filters correctly", () => {
    expect(getAllTasks(mockTasks, false).length).toBe(6); // all non-completed including no due
    expect(getAllTasks(mockTasks, true).length).toBe(7);
  });

  it("getViewTasks switches correctly", () => {
    expect(getViewTasks(mockTasks, "today", false).length).toBe(1);
    expect(getViewTasks(mockTasks, "next7", false).length).toBe(4);
    expect(getViewTasks(mockTasks, "upcoming", false).length).toBe(1);
    expect(getViewTasks(mockTasks, "all", false).length).toBe(6);
  });
});
