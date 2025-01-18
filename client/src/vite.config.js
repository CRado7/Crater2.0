import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Local development port
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000', // Local backend during development
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env': process.env, // Ensure environment variables are passed correctly
  },
});

