import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Listen on IPv4 and IPv6, so port forwarding from containers and VS Code reaches the server.
    host: true,
    port: 8080,
    strictPort: true,
    proxy: {
      '/api': apiTarget,
    },
  },
  preview: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy: {
      '/api': apiTarget,
    },
  },
});
