import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tanstack/react-router": path.resolve(__dirname, "src/lib/tanstack-router-shim.tsx"),
      "@tanstack/react-start": path.resolve(__dirname, "src/lib/tanstack-router-shim.tsx"),
    },
  },
});
