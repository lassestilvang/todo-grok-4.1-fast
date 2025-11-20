import { z } from "zod";
import type { NewList, NewTask } from "@/types";

export const CreateListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color hex")
    .optional(),
  emoji: z.string().min(1).max(2).optional(),
});

export const UpdateListSchema = CreateListSchema.partial();

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;

export const CreateTaskSchema = z.object({
  listId: z.coerce.number().int().positive("Valid list ID required"),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priority: z.enum(["none", "low", "medium", "high"]).optional(),
  dueDate: z.string().optional(), // ISO date string
  estimateDuration: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Format HH:MM")
    .default("00:00")
    .optional(),
  recurringType: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.pick({
  name: true,
  description: true,
  priority: true,
  dueDate: true,
  estimateDuration: true,
  recurringType: true,
}).partial();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export const CreateLabelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color hex")
    .optional(),
});

export const UpdateLabelSchema = CreateLabelSchema.partial();

export type CreateLabelInput = z.infer<typeof CreateLabelSchema>;
export type UpdateLabelInput = z.infer<typeof UpdateLabelSchema>;
