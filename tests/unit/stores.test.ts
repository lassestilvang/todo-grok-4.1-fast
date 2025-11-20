import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLists, getLabels, getTasks } from "@/lib/actions";
import useLabelsStore from "@/stores/useLabelsStore";
import useListsStore from "@/stores/useListsStore";
import { useTasks } from "@/stores/useTasks";
import { useUIStore } from "@/stores/useUIStore";

vi.mock("@/lib/actions");

describe("stores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useListsStore", () => {
    it("fetchLists fetches lists, sets state, manages loading", async () => {
      const mockLists = [
        {
          id: 1,
          name: "Inbox",
          color: "#ff0000",
          emoji: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ];
      vi.mocked(getLists).mockResolvedValue(mockLists as any);

      const store = useListsStore.getState();
      await store.fetchLists();

      expect(getLists).toHaveBeenCalledTimes(1);
      expect(store.lists).toEqual(mockLists);
      expect(store.isLoading).toBe(false);
    });

    it("optimisticAddList adds new list to front of array", () => {
      const mockList = {
        id: 99,
        name: "New List",
        color: "#00ff00",
        emoji: null,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };
      const store = useListsStore.getState();
      store.optimisticAddList(mockList);

      expect(store.lists[0]).toBe(mockList);
    });
  });

  describe("useLabelsStore", () => {
    it("fetchLabels fetches labels, sets state, manages loading", async () => {
      const mockLabels = [{ id: 1, name: "Important", color: "#ff0000" }];
      vi.mocked(getLabels).mockResolvedValue(mockLabels as any);

      const store = useLabelsStore.getState();
      await store.fetchLabels();

      expect(getLabels).toHaveBeenCalledTimes(1);
      expect(store.labels).toEqual(mockLabels);
      expect(store.isLoading).toBe(false);
    });

    it("optimisticAddLabel adds new label to front", () => {
      const mockLabel = { id: 99, name: "New Label", color: "#00ff00" };
      const store = useLabelsStore.getState();
      store.optimisticAddLabel(mockLabel);

      expect(store.labels[0]).toBe(mockLabel);
    });

    it("addLabel calls createLabel and adds to state", async () => {
      const input = { name: "New Label" };
      const mockLabel = { id: 99, name: "New Label", color: "#00ff00" };
      vi.mocked(require("@/lib/actions").createLabel).mockResolvedValue(
        mockLabel as any
      );

      const store = useLabelsStore.getState();
      const label = await store.addLabel(input);

      expect(label).toBe(mockLabel);
      expect(store.labels[0]).toBe(mockLabel);
    });

    it("optimisticUpdateLabel updates label in state", () => {
      const initialLabels = [{ id: 1, name: "Old", color: "#ff0000" }];
      const store = useLabelsStore.getState();
      store.fetchLabels = vi.fn(); // skip
      store.labels = initialLabels; // direct set for test

      const updatedLabel = { id: 1, name: "Updated", color: "#ff0000" };
      store.optimisticUpdateLabel(1, updatedLabel);

      expect(store.labels[0]!.name).toBe("Updated");
    });

    it("optimisticDeleteLabel removes label from state", () => {
      const initialLabels = [{ id: 1, name: "To Delete", color: "#ff0000" }];
      const store = useLabelsStore.getState();
      store.labels = initialLabels;

      store.optimisticDeleteLabel(1);

      expect(store.labels).toEqual([]);
    });
  });

  describe("useTasks", () => {
    it("fetchTasks fetches tasks, sets state, manages loading", async () => {
      const mockTasks = [
        {
          id: 1,
          name: "Test Task",
          description: null,
          listId: 1,
          scheduledDate: null,
          dueDate: null,
          estimateDuration: "00:00",
          actualDuration: null,
          priority: "none",
          recurringType: null,
          completed: 0,
        },
      ];
      vi.mocked(getTasks).mockResolvedValue(mockTasks as any);

      const store = useTasks.getState();
      await store.fetchTasks();

      expect(getTasks).toHaveBeenCalledTimes(1);
      expect(store.tasks).toEqual(mockTasks);
      expect(store.loading).toBe(false);
    });

    it("createTask optimistically adds task to front", async () => {
      const input = { listId: 1, name: "New Task" };
      const mockTask = { id: 99, name: "New Task" };
      vi.mocked(require("@/lib/actions").createTask).mockResolvedValue(
        mockTask as any
      );

      const store = useTasks.getState();
      await store.createTask(input);

      expect(store.tasks[0]).toBe(mockTask);
    });

    it("updateTask updates task in state", async () => {
      const initialTasks = [
        {
          id: 1,
          name: "Old Task",
          description: null,
          listId: 1,
          scheduledDate: null,
          dueDate: null,
          estimateDuration: "00:00",
          actualDuration: null,
          priority: "none",
          recurringType: null,
          completed: 0,
        },
      ];
      const store = useTasks.getState();
      store.tasks = initialTasks;

      const taskId = "1";
      const updatedTask = { name: "Updated Task" };
      store.updateTask(taskId, updatedTask);

      expect(store.tasks[0]!.name).toBe("Updated Task");
    });
  });
});
