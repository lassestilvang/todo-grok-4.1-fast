import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import {
  CreateListSchema,
  UpdateListSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateLabelSchema,
  UpdateLabelSchema,
} from "@/lib/validators";

describe("utils", () => {
  describe("cn", () => {
    it("combines multiple class names", () => {
      expect(cn("foo", "bar baz")).toBe("foo bar baz");
    });

    it("handles conditional classes with objects", () => {
      expect(cn("base", { active: true, inactive: false })).toBe("base active");
    });

    it("trims whitespace", () => {
      expect(cn("  foo   ", " bar ")).toBe("foo bar");
    });

    it("merges Tailwind classes correctly", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("handles empty inputs", () => {
      // @ts-expect-error testing empty
      expect(cn()).toBe("");
      expect(cn("")).toBe("");
    });
  });

  describe("validators", () => {
    describe("CreateListSchema", () => {
      it("validates minimal valid list", () => {
        const data = { name: "Inbox" };
        const result = CreateListSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it("rejects empty name", () => {
        const data = { name: "" };
        const result = CreateListSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe("Name is required");
      });

      it("accepts valid hex color", () => {
        const data = { name: "Test", color: "#FF5733" };
        expect(CreateListSchema.safeParse(data).success).toBe(true);
      });

      it("rejects invalid hex color", () => {
        const data = { name: "Test", color: "#GGG" };
        const result = CreateListSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe("Invalid color hex");
      });

      it("accepts valid emoji", () => {
        const data = { name: "Test", emoji: "📱" };
        expect(CreateListSchema.safeParse(data).success).toBe(true);
      });

      it("rejects long emoji", () => {
        const data = { name: "Test", emoji: "🔥🔥🔥" };
        const result = CreateListSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain("2 character");
      });
    });

    describe("UpdateListSchema", () => {
      it("allows partial updates", () => {
        const data = { color: "#123456" };
        expect(UpdateListSchema.safeParse(data).success).toBe(true);
      });

      it("accepts empty partial", () => {
        expect(UpdateListSchema.safeParse({}).success).toBe(true);
      });
    });

    describe("CreateTaskSchema", () => {
      it("validates minimal task", () => {
        const data = { listId: 1, name: "Buy milk" };
        expect(CreateTaskSchema.safeParse(data).success).toBe(true);
      });

      it("rejects invalid listId", () => {
        const data = { listId: -1, name: "Test" };
        const result = CreateTaskSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe("Valid list ID required");
      });

      it("accepts valid priority", () => {
        const data = { listId: 1, name: "Test", priority: "high" };
        expect(CreateTaskSchema.safeParse(data).success).toBe(true);
      });

      it("rejects invalid priority", () => {
        const data = { listId: 1, name: "Test", priority: "invalid" };
        const result = CreateTaskSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain("none");
      });

      it("accepts valid due date", () => {
        const data = { listId: 1, name: "Test", dueDate: "2023-12-31" };
        expect(CreateTaskSchema.safeParse(data).success).toBe(true);
      });
    });

    describe("UpdateTaskSchema", () => {
      it("allows partial updates", () => {
        const data = { priority: "high", dueDate: "2025-12-31" };
        expect(UpdateTaskSchema.safeParse(data).success).toBe(true);
      });

      it("accepts empty partial", () => {
        expect(UpdateTaskSchema.safeParse({}).success).toBe(true);
      });
    });

    describe("CreateLabelSchema", () => {
      it("validates minimal valid label", () => {
        const data = { name: "Important" };
        const result = CreateLabelSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it("rejects empty name", () => {
        const data = { name: "" };
        const result = CreateLabelSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe("Name is required");
      });

      it("accepts valid color", () => {
        const data = { name: "Important", color: "#FF5733" };
        expect(CreateLabelSchema.safeParse(data).success).toBe(true);
      });

      it("rejects invalid color", () => {
        const data = { name: "Important", color: "#GGG" };
        const result = CreateLabelSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe("Invalid color hex");
      });
    });

    describe("UpdateLabelSchema", () => {
      it("allows partial updates", () => {
        const data = { color: "#123456" };
        expect(UpdateLabelSchema.safeParse(data).success).toBe(true);
      });

      it("accepts empty partial", () => {
        expect(UpdateLabelSchema.safeParse({}).success).toBe(true);
      });
    });
  });
});
