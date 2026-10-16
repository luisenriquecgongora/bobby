import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Tauri expects a fixed port, fail if that port is not available
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
  clearScreen: false,
  server: {
    port: 3301,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
