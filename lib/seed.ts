import { eq } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema";

(async () => {
  const db = await getDb();
  const inbox = await db
    .select()
    .from(schema.lists)
    .where(eq(schema.lists.name, "Inbox"));
  if (inbox.length === 0) {
    const newList = await db
      .insert(schema.lists)
      .values({
        name: "Inbox",
        color: "#3b82f6",
        emoji: "📥",
      })
      .returning();
    const inboxId = newList[0].id!;
    await db.insert(schema.tasks).values([
      {
        listId: inboxId,
        name: "Welcome to Todo",
        description: "This is your Inbox. Add tasks here!",
        priority: "medium",
      },
      {
        listId: inboxId,
        name: "Sample recurring task",
        recurringType: "daily",
        priority: "low",
      },
    ]);
    console.log("✅ Seeded Inbox list and 2 sample tasks.");
  } else {
    console.log("ℹ️ Inbox already exists, skipping seed.");
  }
  process.exit(0);
})();
