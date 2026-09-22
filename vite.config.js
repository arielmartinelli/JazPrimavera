import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8888,
    host: true,
    strictPort: false // Si el puerto 8888 está ocupado, buscará automáticamente el siguiente libre
  }
});
