CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer,
	`file_key` text
);
--> statement-breakpoint
CREATE TABLE `labels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text(7) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text(7) NOT NULL,
	`emoji` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recurring_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applies_to_list_item` integer,
	`frequency` text,
	`repeats_by` text,
	`repeats_on` text
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`preference` text,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `subtasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`completed` integer
);
--> statement-breakpoint
CREATE TABLE `task_labels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer,
	`label_id` integer
);
--> statement-breakpoint
CREATE TABLE `task_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer,
	`action` text
);
--> statement-breakpoint
CREATE TABLE `task_recurrences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recurrence_id` integer,
	`scheduled_at` text,
	`started_at` text,
	`ended_at` text
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`list_id` integer,
	`name` text NOT NULL,
	`description` text,
	`scheduled_date` text,
	`deadline` text,
	`estimate_duration` text(8) DEFAULT '00:00',
	`actual_duration` text(8),
	`priority` text DEFAULT 'none',
	`recurring_type` text,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `views_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`per_page` integer
);
