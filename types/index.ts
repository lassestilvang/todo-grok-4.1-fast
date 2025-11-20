import type * as schema from "../lib/schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type List = InferSelectModel<typeof schema.lists>;
export type NewList = InferInsertModel<typeof schema.lists>;

export type Task = InferSelectModel<typeof schema.tasks> & { labels?: Label[] };

export type NewTask = InferInsertModel<typeof schema.tasks>;

export type Subtask = InferSelectModel<typeof schema.subtasks>;
export type NewSubtask = InferInsertModel<typeof schema.subtasks>;

export type TaskLabel = InferSelectModel<typeof schema.task_labels>;
export type NewTaskLabel = InferInsertModel<typeof schema.task_labels>;

export type Label = InferSelectModel<typeof schema.labels>;
export type NewLabel = InferInsertModel<typeof schema.labels>;

export type Attachment = InferSelectModel<typeof schema.attachments>;
export type NewAttachment = InferInsertModel<typeof schema.attachments>;

export type Reminder = InferSelectModel<typeof schema.reminders>;
export type NewReminder = InferInsertModel<typeof schema.reminders>;

export type TaskLog = InferSelectModel<typeof schema.task_logs>;
export type NewTaskLog = InferInsertModel<typeof schema.task_logs>;

export type ViewConfig = InferSelectModel<typeof schema.views_config>;
export type NewViewConfig = InferInsertModel<typeof schema.views_config>;

export type RecurringRule = InferSelectModel<typeof schema.recurring_rules>;
export type NewRecurringRule = InferInsertModel<typeof schema.recurring_rules>;

export type TaskRecurrence = InferSelectModel<typeof schema.task_recurrences>;
export type NewTaskRecurrence = InferInsertModel<
  typeof schema.task_recurrences
>;

export type Setting = InferSelectModel<typeof schema.settings>;
export type NewSetting = InferInsertModel<typeof schema.settings>;
