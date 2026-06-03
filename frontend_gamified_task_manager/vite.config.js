import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow running inside containerized environments.
    host: true,
    // Windows-safe port configuration:
    // - Default to 3000 (preview expectation)
    // - Allow override via VITE_PORT when it's a valid integer
    port: Number.isFinite(Number(process.env.VITE_PORT))
      ? Number(process.env.VITE_PORT)
      : 3000
  }
});
