import { create } from "zustand";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
} from "@/lib/actions";
import type { Task } from "@/types";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validators";

interface TasksStore {
  tasks: Task[];
  currentListId: number | null;
  loading: boolean;
  setTasks: (tasks: any[]) => void;
  setCurrentListId: (listId: number | null) => void;
  setTasksLoading: (loading: boolean) => void;
  fetchTasks: () => Promise<void>;
  createTask: (newTask: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleComplete: (taskId: number) => Promise<void>;
}

export const useTasks = create<TasksStore>((set) => ({
  tasks: [],
  currentListId: null,
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  setCurrentListId: (listId) => set({ currentListId: listId }),
  setTasksLoading: (loading) => set({ loading }),
  fetchTasks: async (): Promise<void> => {
    try {
      set({ loading: true });
      const tasks = await getTasks();
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  createTask: async (newTask: CreateTaskInput): Promise<Task> => {
    const createdTask = await createTask(newTask);
    set((state) => ({
      // Optimistically add the new task to the beginning of the list
      tasks: [createdTask, ...state.tasks],
    }));
    return createdTask;
  },
  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const result = await updateTask(id, input);
    set((state) => ({
      // Find and update the task
      tasks: state.tasks.map((task: any) => (task.id === id ? result : task)),
    }));
    return result;
  },
  deleteTask: async (taskId: number): Promise<void> => {
    await deleteTask(String(taskId));
    set((state) => ({
      // Remove the task
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },
  toggleComplete: async (taskId: number): Promise<void> => {
    await toggleComplete(String(taskId));
    set((state) => ({
      // Find and update the completion status
      tasks: state.tasks.map((task) => {
        if (task.id === taskId) {
          const completed = task.completed ? 0 : 1;
          return { ...task, completed };
        }
        return task;
      }),
    }));
  },
}));
