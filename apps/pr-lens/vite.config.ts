import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'node:crypto': fileURLToPath(new URL('./src/crypto-stub.ts', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5174,
  },
  optimizeDeps: {
    exclude: ['@coldtea/pr-lens-renderer', '@coldtea/pr-lens-schema'],
  },
})

