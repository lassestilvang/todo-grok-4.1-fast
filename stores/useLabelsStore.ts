import { create } from "zustand";
import { getLabels, createLabel, updateLabel, deleteLabel } from "@/lib/actions";
import type { Label } from "@/types";
import type { CreateLabelInput, UpdateLabelInput } from "@/lib/validators";

interface LabelsStore {
  labels: Label[];
  isLoading: boolean;
  fetchLabels: () => Promise<void>;
  addLabel: (input: CreateLabelInput) => Promise<Label>;
  optimisticAddLabel: (label: Label) => void;
  updateLabel: (id: number, input: UpdateLabelInput) => Promise<Label>;
  optimisticUpdateLabel: (id: number, label: Label) => void;
  deleteLabel: (id: number) => Promise<void>;
  optimisticDeleteLabel: (id: number) => void;
}

const useLabelsStore = create<LabelsStore>()((set) => ({
  labels: [],
  isLoading: false,
  fetchLabels: async () => {
    set({ isLoading: true });
    try {
      const labels = await getLabels();
      set({ labels });
    } finally {
      set({ isLoading: false });
    }
  },
  optimisticAddLabel: (label: Label) => {
    set((state) => ({
      labels: [label, ...state.labels],
    }));
  },
  addLabel: async (input: CreateLabelInput) => {
    const label = await createLabel(input);
    set((state) => ({
      labels: [label, ...state.labels],
    }));
    return label;
  },
  optimisticUpdateLabel: (id: number, updatedLabel: Label) => {
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === id ? updatedLabel : label
      ),
    }));
  },
  updateLabel: async (id: number, input: UpdateLabelInput) => {
    const label = await updateLabel(String(id), input);
    set((state) => ({
      labels: state.labels.map((l) => (l.id === id ? label : l)),
    }));
    return label;
  },
  optimisticDeleteLabel: (id: number) => {
    set((state) => ({
      labels: state.labels.filter((label) => label.id !== id),
    }));
  },
  deleteLabel: async (id: number) => {
    await deleteLabel(String(id));
    set((state) => ({
      labels: state.labels.filter((label) => label.id !== id),
    }));
  },
}));

export default useLabelsStore;
