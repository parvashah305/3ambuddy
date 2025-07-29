import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow access via external IP or domain
    allowedHosts: ['3ambuddy.work.gd'], // allow your custom domain
    port: 5173 // (optional) specify port if not default
  }
})
