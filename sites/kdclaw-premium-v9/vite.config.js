import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/kdclaw-premium-v9/',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
