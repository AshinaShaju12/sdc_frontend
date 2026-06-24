import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_BASE_URL || 'http://localhost:8000';

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 5000,
      open: true,
     proxy: {
  '/api/generate-document': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    secure: false,
  },

  '/api': {
    target: backendUrl,
    changeOrigin: true,
    secure: false,
  },

  '/media': {
    target: backendUrl,
    changeOrigin: true,
    secure: false,
  }
}
    }
  };
});

