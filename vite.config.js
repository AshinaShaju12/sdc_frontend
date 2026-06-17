import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://semisweet-craziness-dreamless.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
