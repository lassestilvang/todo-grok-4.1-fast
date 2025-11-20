import { create } from "zustand";
import { getLists } from "@/lib/actions";
import type { List } from "@/types";

interface ListsStore {
  lists: List[];
  isLoading: boolean;
  fetchLists: () => Promise<void>;
  addList: (list: List) => void;
  optimisticAddList: (list: List) => void;
}

const useListsStore = create<ListsStore>((set) => ({
  lists: [],
  isLoading: false,
  fetchLists: async () => {
    set({ isLoading: true });
    try {
      const lists = await getLists();
      set({ lists });
    } finally {
      set({ isLoading: false });
    }
  },
  addList: (list: List) => {
    set((state) => ({
      lists: [list, ...state.lists],
    }));
  },
  optimisticAddList: (list: List) => {
    set((state) => ({
      lists: [list, ...state.lists],
    }));
  },
}));

export default useListsStore;
