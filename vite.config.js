import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
    root: "./client",
    plugins: [react()],
    server: {
        open: true,
        proxy: {
            "/socket.io": {
                target: `http://localhost:${PORT}`,
                changeOrigin: true,
                ws: true,
            },
        },
    },
    build: {
        // relative to project-root/index.html
        outDir: "../dist/app",
        emptyOutDir: true,
    },
});
