import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import Fonts from "unplugin-fonts/vite";
import Components from "unplugin-vue-components/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    tailwindcss(),
    Vuetify(),
    Components(),
    Fonts({
      fontsource: {
        families: [
          {
            name: "Roboto",
            weights: [100, 300, 400, 500, 700, 900],
            styles: ["normal", "italic"],
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["vuetify"],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
