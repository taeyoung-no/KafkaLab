import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/produce': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/reset': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },

      '/api/stream': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        timeout: 0,
        proxyTimeout: 0,
      },
    },
  },
})
