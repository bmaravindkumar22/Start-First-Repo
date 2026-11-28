import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Requests to /api/... from the page go to the deployed server instead.
            // The browser only talks to localhost, so the missing CORS header doesn't matter here.
            "/api": {
                target: "https://resume-fixer-server.vercel.app",
                changeOrigin: true,
            },
        },
    },
});
