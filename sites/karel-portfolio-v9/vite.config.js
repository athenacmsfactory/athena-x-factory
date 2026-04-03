import { defineConfig } from 'vite'

export default defineConfig({
  // Set base to relative for GitHub Pages or a specific sub-path
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 5200
  }
})
