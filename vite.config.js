import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'SafeSignal',
          short_name: 'SafeSignal',
          theme_color: '#B71C1C',
          icons: [/* Array of icon objects */]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
      }),
    tailwindcss(),
  ],
});
