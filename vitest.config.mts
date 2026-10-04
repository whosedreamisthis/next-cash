import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the "@/*" alias from tsconfig.json
  resolve: { tsconfigPaths: true },
  // Matches tsconfig's "jsx": "react-jsx", so components don't import React
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
