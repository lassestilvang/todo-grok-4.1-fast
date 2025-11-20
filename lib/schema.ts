import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const lists = sqliteTable("lists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color", { length: 7 }).notNull(),
  emoji: text("emoji"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  listId: integer("list_id").references(() => lists.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  scheduledDate: text("scheduled_date"),
  dueDate: text("due_date"),
  estimateDuration: text("estimate_duration", { length: 8 }).default("00:00"),
  actualDuration: text("actual_duration", { length: 8 }),
  priority: text("priority", {
    enum: ["none", "low", "medium", "high"],
  }).default("none"),
  recurringType: text("recurring_type"),
  completed: integer("completed").default(0).notNull(),
});

export const subtasks = sqliteTable("subtasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id").references(() => tasks.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  completed: integer("completed").default(0),
});

export const task_labels = sqliteTable("task_labels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id"),
  labelId: integer("label_id"),
});

export const labels = sqliteTable("labels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color", { length: 7 }).notNull(),
});

export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id"),
  fileKey: text("file_key"),
});

export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id"),
  type: text("type", { enum: ["local", "sms", "email"] }).notNull(),
});

export const task_logs = sqliteTable("task_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id"),
  action: text("action"),
});

export const views_config = sqliteTable("views_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  perPage: integer("per_page"),
});

export const recurring_rules = sqliteTable("recurring_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appliesToListItem: integer("applies_to_list_item"),
  frequency: text("frequency", {
    enum: ["daily", "weekly", "monthly", "yearly"],
  }),
  repeatsBy: text("repeats_by", {
    enum: ["weekdays", "weekends", "daily", "weekly", "monthly", "yearly"],
  }),
  repeatsOn: text("repeats_on"),
});

export const task_recurrences = sqliteTable("task_recurrences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recurrenceId: integer("recurrence_id"),
  scheduledAt: text("scheduled_at"),
  startedAt: text("started_at"),
  endedAt: text("ended_at"),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  preference: text("preference"),
  value: text("value"),
});

export const listsModel = relations(lists, ({ many }) => ({
  tasks: many(tasks),
  settings: many(settings),
}));

export const tasksModel = relations(tasks, ({ one, many }) => ({
  list: one(lists, {
    fields: [tasks.listId],
    references: [lists.id],
  }),
  subtasks: many(subtasks),
  reminders: many(reminders),
  attachments: many(attachments),
  recurrences: many(task_recurrences),
  logs: many(task_logs),
  owner: one(settings, {
    fields: [tasks.id],
    references: [settings.userId],
  }),
}));

export const taskRelations = relations(tasks, ({ many }) => ({
  taskLabels: many(task_labels),
}));

export const task_labelsModel = relations(task_labels, ({ one }) => ({
  task: one(tasks, {
    fields: [task_labels.taskId],
    references: [tasks.id],
  }),
  label: one(labels, {
    fields: [task_labels.labelId],
    references: [labels.id],
  }),
}));

export const subtasksModel = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const remindersModel = relations(reminders, ({ one }) => ({
  task: one(tasks, {
    fields: [reminders.taskId],
    references: [tasks.id],
  }),
}));

export const attachmentsModel = relations(attachments, ({ one }) => ({
  task: one(tasks, {
    fields: [attachments.taskId],
    references: [tasks.id],
  }),
}));

export const settingsModel = relations(settings, ({ many, one }) => ({
  lists: many(lists),
  view: many(views_config),
  owner: one(tasks, {
    fields: [settings.userId],
    references: [tasks.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  taskLabels: many(task_labels),
}));

export const taskLabelsRelations = relations(task_labels, ({ one }) => ({
  task: one(tasks, {
    fields: [task_labels.taskId],
    references: [tasks.id],
  }),
  label: one(labels, {
    fields: [task_labels.labelId],
    references: [labels.id],
  }),
}));

export const taskLogsModel = relations(task_logs, ({ one }) => ({
  task: one(tasks, {
    fields: [task_logs.taskId],
    references: [tasks.id],
  }),
}));

export const schema = {
  lists,
  tasks,
  subtasks,
  task_labels,
  labels,
  attachments,
  reminders,
  task_logs,
  views_config,
  recurring_rules,
  task_recurrences,
  settings,
} as const;
