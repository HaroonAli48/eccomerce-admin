import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow external access (important for Render)
    port: process.env.PORT || 5174,  // Use Render's assigned port
  },
})
