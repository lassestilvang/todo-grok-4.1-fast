import { create } from "zustand";

export type ActiveView = "today" | "next7" | "upcoming" | "all";

interface UIStore {
  activeView: ActiveView;
  showCompleted: boolean;
  searchQuery: string;
  editingTaskId: number | null;
  setActiveView: (view: ActiveView) => void;
  setShowCompleted: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setEditingTaskId: (id: number | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: "all",
  showCompleted: false,
  searchQuery: "",
  editingTaskId: null,
  setActiveView: (activeView) => set({ activeView }),
  setShowCompleted: (showCompleted) => set({ showCompleted }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEditingTaskId: (editingTaskId) => set({ editingTaskId }),
}));
