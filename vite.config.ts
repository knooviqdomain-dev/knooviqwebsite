import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-bundle';
            }
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
              return 'framer-motion-bundle';
            }
            if (id.includes('@supabase')) {
              return 'supabase-bundle';
            }
            if (id.includes('lucide-react')) {
              return 'icons-bundle';
            }
            return 'vendor-libs';
          }
          if (id.includes('/src/pages/industries/')) {
            return 'chunk-industries';
          }
          if (id.includes('/src/pages/digital-intelligence/')) {
            return 'chunk-intelligence';
          }
          if (id.includes('/src/pages/cloud-operations/')) {
            return 'chunk-cloud-ops';
          }
          if (id.includes('/src/pages/about/')) {
            return 'chunk-about';
          }
          if (id.includes('/src/pages/ai/')) {
            return 'chunk-ai-products';
          }
        },
      },
    },
  },
});
