"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, asc, sql, desc, and } from "drizzle-orm";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateListSchema,
} from "./validators";
import type {
  Task,
  List,
  Subtask,
  NewSubtask,
  TaskLog,
  Attachment,
  Label,
} from "@/types";
import { CreateLabelSchema, UpdateLabelSchema } from "./validators";
import * as fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function getSubtasks(taskId: number): Promise<Subtask[]> {
  const db = await getDb();
  return await db
    .select()
    .from(schema.subtasks)
    .where(eq(schema.subtasks.taskId, taskId))
    .orderBy(asc(schema.subtasks.name));
}

export async function createSubtask(
  taskId: number,
  input: Pick<NewSubtask, "name" | "description">
): Promise<Subtask> {
  const db = await getDb();
  const [created] = await db
    .insert(schema.subtasks)
    .values({
      taskId,
      ...input,
    })
    .returning();
  revalidatePath("/");
  return created!;
}

export async function toggleSubtaskComplete(
  subtaskId: number
): Promise<Subtask> {
  const db = await getDb();
  const [updated] = await db
    .update(schema.subtasks)
    .set({ completed: sql`1 - ${schema.subtasks.completed}` })
    .where(eq(schema.subtasks.id, subtaskId))
    .returning();
  revalidatePath("/");
  return updated!;
}

export async function deleteSubtask(subtaskId: number): Promise<void> {
  const db = await getDb();
  await db.delete(schema.subtasks).where(eq(schema.subtasks.id, subtaskId));
  revalidatePath("/");
}

export async function getTaskLogs(taskId: number): Promise<TaskLog[]> {
  const db = await getDb();
  return await db
    .select()
    .from(schema.task_logs)
    .where(eq(schema.task_logs.taskId, taskId))
    .orderBy(desc(schema.task_logs.id));
}

export async function getAttachments(taskId: number): Promise<Attachment[]> {
  const db = await getDb();
  return await db
    .select()
    .from(schema.attachments)
    .where(eq(schema.attachments.taskId, taskId));
}

export async function getLists(): Promise<List[]> {
  const db = await getDb();
  return await db.query.lists.findMany({
    orderBy: [asc(schema.lists.name)],
  });
}

export async function getTasks(
  listId?: string,
  view?: string
): Promise<Task[]> {
  const db = await getDb();
  const tasksWithLabels = await db.query.tasks.findMany({
    where: (tasks: any, { eq, and, sql }: any) => {
      const conditions: any[] = [];
      if (listId) {
        conditions.push(eq(tasks.listId, Number(listId)));
      }
      if (view === "overdue") {
        conditions.push(
          and(
            eq(tasks.completed, 0),
            sql`datetime(${tasks.dueDate}) < datetime('now')`
          )
        );
      }
      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    orderBy: [asc(schema.tasks.name)],
  });

  const tasks: Task[] = [];
  for (const task of tasksWithLabels) {
    const labels = await db
      .select()
      .from(schema.labels)
      .where(
        eq(
          schema.labels.id,
          sql`(select labelId from task_labels where taskId = ${task.id})`
        )
      );

    if (Array.isArray(task.labels) && Array.isArray(labels)) {
      task.labels = task.labels.concat(labels);
    } else {
      task.labels = labels;
    }

    (task as any).labelsCount = task.labels ? task.labels.length : 0;

    tasks.push(task);
  }

  return tasks;
}

export async function createList(input: unknown): Promise<List> {
  const db = await getDb();
  const validated = CreateListSchema.parse(input);
  const fullInput = {
    ...validated,
    color: validated.color || "#3b82f6",
  };
  const [list] = await db.insert(schema.lists).values(fullInput).returning();
  revalidatePath("/");
  return list!;
}

export async function createTask(input: unknown): Promise<Task> {
  const db = await getDb();
  const validated = CreateTaskSchema.parse(input);
  const [task] = await db.insert(schema.tasks).values(validated).returning();
  revalidatePath("/");
  return task!;
}

export async function updateTask(id: string, input: unknown): Promise<Task> {
  const db = await getDb();
  const validated = UpdateTaskSchema.parse(input);
  const taskId = Number(id);
  const oldTask = await db.query.tasks.findFirst({
    where: eq(schema.tasks.id, taskId),
  });
  if (!oldTask) {
    throw new Error("Task not found");
  }

  const changes: Record<string, { old: any; new: any }> = {};
  if ("name" in validated && validated.name !== oldTask.name) {
    changes.name = { old: oldTask.name, new: validated.name };
  }
  if (
    "description" in validated &&
    validated.description !== oldTask.description
  ) {
    changes.description = {
      old: oldTask.description,
      new: validated.description,
    };
  }
  if ("priority" in validated && validated.priority !== oldTask.priority) {
    changes.priority = { old: oldTask.priority, new: validated.priority };
  }
  if ("dueDate" in validated && validated.dueDate !== oldTask.dueDate) {
    changes.dueDate = { old: oldTask.dueDate, new: validated.dueDate };
  }
  if ("completed" in validated && validated.completed !== oldTask.completed) {
    changes.completed = { old: oldTask.completed, new: validated.completed };
  }

  if (Object.keys(changes).length > 0) {
    await db.insert(schema.task_logs).values({
      taskId,
      action: JSON.stringify({ type: "update", changes }),
    });
  }

  const [updated] = await db
    .update(schema.tasks)
    .set(validated)
    .where(eq(schema.tasks.id, taskId))
    .returning();
  revalidatePath("/");
  return updated!;
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  const taskId = Number(id);
  await db.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
  revalidatePath("/");
}

export async function toggleComplete(id: string): Promise<Task> {
  const db = await getDb();
  const taskId = Number(id);
  const [updated] = await db
    .update(schema.tasks)
    .set({ completed: sql`1 - ${schema.tasks.completed}` })
    .where(eq(schema.tasks.id, taskId))
    .returning();
  revalidatePath("/");
  return updated!;
}

export async function getLabels(): Promise<Label[]> {
  const db = await getDb();
  return await db.query.labels.findMany({
    orderBy: [asc(schema.labels.name)],
  });
}

export async function createLabel(input: unknown): Promise<Label> {
  const db = await getDb();
  const validated = CreateLabelSchema.parse(input);
  const fullInput = {
    ...validated,
    color: validated.color || "#3b82f6",
  };
  const [label] = await db.insert(schema.labels).values(fullInput).returning();
  revalidatePath("/");
  return label!;
}

export async function updateLabel(id: string, input: unknown): Promise<Label> {
  const db = await getDb();
  const validated = UpdateLabelSchema.parse(input);
  const labelId = Number(id);
  const [updated] = await db
    .update(schema.labels)
    .set(validated)
    .where(eq(schema.labels.id, labelId))
    .returning();
  revalidatePath("/");
  return updated!;
}

export async function deleteLabel(id: string): Promise<void> {
  const db = await getDb();
  const labelId = Number(id);
  await db.delete(schema.labels).where(eq(schema.labels.id, labelId));
  revalidatePath("/");
}

export async function assignLabelsToTask(
  taskId: number,
  labelIds: number[]
): Promise<void> {
  const db = await getDb();
  await db
    .delete(schema.task_labels)
    .where(eq(schema.task_labels.taskId, taskId));
  if (labelIds.length > 0) {
    await db
      .insert(schema.task_labels)
      .values(labelIds.map((labelId) => ({ taskId, labelId })));
  }
  revalidatePath("/");
}

export async function uploadAttachments(formData: FormData): Promise<string[]> {
  const files = formData.getAll("files") as File[];
  const urls: string[] = [];
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uuid = crypto.randomUUID();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(file.name);
    const filename = `${uuid}-${sanitizedName}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);
    urls.push(`/uploads/${filename}`);
  }
  return urls;
}

export async function addAttachment(
  taskId: number,
  fileKey: string
): Promise<Attachment> {
  const db = await getDb();
  const [attachment] = await db
    .insert(schema.attachments)
    .values({ taskId, fileKey })
    .returning();
  revalidatePath("/");
  return attachment!;
}
