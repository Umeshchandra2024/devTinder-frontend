import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const RENDER_API = 'https://devtinder-hg5f.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Same-origin in dev so HttpOnly cookies from login are stored and sent (see constants.js BASE_URL in DEV).
      '/api': {
        target: RENDER_API,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
