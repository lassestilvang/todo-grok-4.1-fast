import { describe, it, expect, beforeAll } from "bun:test";
import { db } from "../..//db";
import * as schema from "../..//schema";
import { eq, gt } from "drizzle-orm";

describe("DB Integration Tests", () => {
  let inboxId: number;

  beforeAll(async () => {
    const lists = await db.select().from(schema.lists);
    inboxId = lists[0]!.id;
  });

  it("connects and queries lists", async () => {
    const lists = await db.select().from(schema.lists);
    expect(lists.length).toBeGreaterThan(0);
    expect(lists[0].name).toBe("Inbox");
  });

  it("queries tasks for Inbox", async () => {
    const tasks = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.listId, inboxId));
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("inserts new task", async () => {
    const newTask = await db
      .insert(schema.tasks)
      .values({
        listId: inboxId,
        name: "Integration test task",
        priority: "low",
      })
      .returning();
    expect(newTask[0].name).toBe("Integration test task");
    expect(newTask[0].priority).toBe("low");
  });

  it("verifies relations (tasks have valid listId FK)", async () => {
    const tasks = await db.select().from(schema.tasks);
    expect(tasks[0].listId).toBeDefined();
    expect(tasks[0].listId).toBeGreaterThan(0);
  });
});
