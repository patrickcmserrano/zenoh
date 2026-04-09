import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/zenoh/',
  plugins: [svelte()],
  server: {
    fs: {
      // Allow serving files from the project root (one level up from docs-viewer)
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../..')
      ]
    }
  }
})
