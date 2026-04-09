import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const serveFromRootPlugin = () => ({
  name: 'serve-from-root',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const mappings = {
        '/docs/': '../docs/',
        '/co-creation/': '../co-creation/',
        '/research/': '../research/',
        '/ROOT_README.md': '../README.md'
      };
      
      const urlSplit = req.url.split('?');
      const urlPath = urlSplit[0];
      
      for (const [urlPrefix, relativeTarget] of Object.entries(mappings)) {
        if (urlPath === urlPrefix || urlPath.startsWith(urlPrefix)) {
          let suffix = '';
          if (urlPrefix.endsWith('/')) {
             suffix = urlPath.slice(urlPrefix.length);
          }
          const targetPath = path.resolve(__dirname, relativeTarget, suffix);
          req.url = '/@fs/' + targetPath + (urlSplit.length > 1 ? '?' + urlSplit[1] : '');
          break;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // base: '/zenoh/' apenas em produção (GitHub Pages)
  base: command === 'build' ? '/zenoh/' : '/',
  plugins: [svelte(), serveFromRootPlugin()],
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../..')
      ]
    }
  }
}))
