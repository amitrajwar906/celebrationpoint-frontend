import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'unpopulously-undeclarative-eneida.ngrok-free.dev'
    ]
  }
})
