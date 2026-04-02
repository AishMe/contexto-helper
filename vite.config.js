// vite.config.js
// Configures Vite with React plugin
// Also sets up a proxy for the /api route during local development
// so that fetch('/api/suggest') hits the local serverless function simulator

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});