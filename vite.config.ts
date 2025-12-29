import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/lib"],
      outDir: "dist",
      rollupTypes: true,
    }),
    {
      name: "copy-css",
      closeBundle() {
        // Ensure dist directory exists
        if (!existsSync("dist")) {
          mkdirSync("dist", { recursive: true });
        }
        // Copy CSS file to dist
        copyFileSync("src/lib/styles.css", "dist/styles.css");
        console.log("✓ Copied styles.css to dist/");
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "ReactIOSWheelPicker",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    sourcemap: false,
    minify: "esbuild",
  },
});
