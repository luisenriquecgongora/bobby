import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@bobby/core': path.resolve(__dirname, '../../packages/core/src'),
      '@bobby/engine': path.resolve(__dirname, '../../packages/engine/src'),
      '@bobby/editor': path.resolve(__dirname, '../../packages/editor/src'),
      '@bobby/viewer': path.resolve(__dirname, '../../packages/viewer/src'),
      '@bobby/connector-plaato': path.resolve(__dirname, '../../packages/connector-plaato/src'),
    },
  },
  server: {
    port: 3300,
  },
});
