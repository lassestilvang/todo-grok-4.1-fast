import type { Task } from '@/types';
import { isToday, startOfDay, addDays, isAfter } from 'date-fns';

export type ActiveView = 'today' | 'next7' | 'upcoming' | 'all';

export function getOverdueCount(tasks: Task[]): number {
  const now = new Date();
  return tasks.filter(task => task.dueDate && !task.completed && new Date(task.dueDate as string) < now).length;
}

export function getTodayTasks(tasks: Task[], showCompleted: boolean): Task[] {
  const now = new Date();
  const today = startOfDay(now);
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = startOfDay(new Date(task.dueDate as string));
    if (!isToday(due)) return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });
}

export function getNext7Tasks(tasks: Task[], showCompleted: boolean): Task[] {
  const now = new Date();
  const todayStart = startOfDay(now);
  const next7End = startOfDay(addDays(now, 7));
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueStart = startOfDay(new Date(task.dueDate as string));
    if (dueStart < todayStart || dueStart > next7End) return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });
}

export function getUpcomingTasks(tasks: Task[], showCompleted: boolean): Task[] {
  const now = new Date();
  const next7End = startOfDay(addDays(now, 7));
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueStart = startOfDay(new Date(task.dueDate as string));
    if (!isAfter(dueStart, next7End)) return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });
}

export function getAllTasks(tasks: Task[], showCompleted: boolean): Task[] {
  return tasks.filter(task => showCompleted || !task.completed);
}

export function getViewTasks(tasks: Task[], activeView: ActiveView, showCompleted: boolean): Task[] {
  switch (activeView) {
    case 'today':
      return getTodayTasks(tasks, showCompleted);
    case 'next7':
      return getNext7Tasks(tasks, showCompleted);
    case 'upcoming':
      return getUpcomingTasks(tasks, showCompleted);
    case 'all':
      return getAllTasks(tasks, showCompleted);
    default:
      return [];
  }
}
