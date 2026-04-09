export const serveFromRootPlugin = (rootDir) => ({
  name: 'serve-from-root',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log('Incoming request:', req.url);
      next();
    });
  }
});
