import { create } from "zustand";
import {
  getSubtasks,
  createSubtask,
  toggleSubtaskComplete,
  deleteSubtask,
  getTaskLogs,
  getAttachments,
  addAttachment,
} from "@/lib/actions";
import { useTasks } from "./useTasks";
import type { Task, Subtask, NewSubtask, TaskLog, Attachment } from "@/types";

interface UseTaskState {
  taskId: number | null;
  task: Task | null;
  subtasks: Subtask[];
  logs: TaskLog[];
  attachments: Attachment[];
  loading: boolean;
  loadTask: (id: number) => Promise<void>;
  unloadTask: () => void;
  createSubtask: (
    input: Pick<NewSubtask, "name" | "description">
  ) => Promise<void>;
  toggleSubtask: (id: number) => Promise<void>;
  deleteSubtask: (id: number) => Promise<void>;
  addAttachments: (urls: string[]) => Promise<void>;
}

export const useTask = create<UseTaskState>((set, get) => ({
  taskId: null,
  task: null,
  subtasks: [],
  logs: [],
  attachments: [],
  loading: false,
  loadTask: async (id) => {
    set({ loading: true, taskId: id });
  },
  unloadTask: () => {
    set({ taskId: null });
  },
  createSubtask: async (input) => {
    const taskId = get().taskId as number;
    if (!taskId) return;
    const newSubtask = await createSubtask(taskId, input);
    // Optimistic update
    const currentSubtasks = get().subtasks;
    set({
      subtasks: [
        ...currentSubtasks.slice(0, currentSubtasks.length - 1),
        newSubtask,
        ...currentSubtasks.slice(currentSubtasks.length - 1),
      ],
    });
  },
  toggleSubtask: async (id) => {
    const taskId = get().taskId as number;
    if (!taskId) return;
    const currentSubtasks = get().subtasks;
    const index = currentSubtasks.findIndex((subtask) => subtask.id === id);
    if (index === -1) return;
    const newSubtask = await toggleSubtaskComplete(id);
    // Optimistic update
    set({
      subtasks: [
        ...currentSubtasks.slice(0, index),
        newSubtask,
        ...currentSubtasks.slice(index + 1),
      ],
    });
  },
  deleteSubtask: async (id) => {
    const taskId = get().taskId as number;
    if (!taskId) return;
    // Optimistic update
    const currentSubtasks = get().subtasks;
    set({
      subtasks: currentSubtasks.filter((subtask) => subtask.id !== id),
    });
    await deleteSubtask(id);
  },
  addAttachments: async (urls) => {
    const taskId = get().taskId as number;
    if (!taskId) return;
    // Optimistic update
    const currentAttachments = get().attachments;
    const currentLength = currentAttachments.length;
    set({
      attachments: [
        ...currentAttachments.slice(0, currentLength - 1),
        ...urls.map((url) => ({
          id: Date.now(),
          taskId,
          fileKey: url,
        })),
        ...currentAttachments.slice(currentLength - 1),
      ],
    });
    // Server update
    for (const url of urls) {
      await addAttachment(taskId, url);
    }
  },
}));
