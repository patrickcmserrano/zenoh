import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // base: '/zenoh/' apenas em produção (GitHub Pages)
  base: command === 'build' ? '/zenoh/' : '/',
  plugins: [svelte()],
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../..')
      ]
    }
  }
}))
