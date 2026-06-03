import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Vitest configuration for component/UI tests.
 * - Uses jsdom so React Testing Library can render components.
 * - Loads jest-dom matchers in a setup file.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setupTests.js"],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true
  }
});
