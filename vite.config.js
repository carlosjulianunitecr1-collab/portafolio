import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/* Carpetas de medios que ya existen en el repo (no se mueven):
   en desarrollo Vite las sirve desde la raíz y en el build se copian a dist/. */
const MEDIA_DIRS = ["img", "videos", "modelos3d", "docs"];

const copyMedia = () => ({
  name: "copy-portfolio-media",
  apply: "build",
  closeBundle() {
    for (const dir of MEDIA_DIRS) {
      const from = resolve(dir);
      if (existsSync(from)) cpSync(from, resolve("dist", dir), { recursive: true });
    }
  }
});

export default defineConfig({
  base: "./",
  plugins: [react(), copyMedia()]
});
