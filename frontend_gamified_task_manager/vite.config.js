import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow running inside containerized environments; port is set via scripts to respect VITE_PORT when present.
    host: true
  }
});
