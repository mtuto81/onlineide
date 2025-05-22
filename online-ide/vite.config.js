import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    hmr: {
      host: 'localhost',
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: ['work-1-tvagyniwyeamciqm.prod-runtime.all-hands.dev', 'work-2-tvagyniwyeamciqm.prod-runtime.all-hands.dev'],
  },
})
