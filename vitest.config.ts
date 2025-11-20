import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "stores/**/*.{ts,tsx}",
      ],
      exclude: ["**/node_modules/**", "**/*.config.*", "**/*.d.ts", "tests/**"],
      thresholds: {
        lines: 90,
        functions: 80,
        branches: 80,
        statements: 90,
      },
    },
  },
});
