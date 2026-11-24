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
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules')) {
            if (normalized.includes('three') || normalized.includes('@react-three')) {
              return 'three-bundle';
            }
            if (normalized.includes('framer-motion') || normalized.includes('gsap') || normalized.includes('lenis')) {
              return 'framer-motion-bundle';
            }
            if (normalized.includes('@supabase')) {
              return 'supabase-bundle';
            }
            if (normalized.includes('lucide-react')) {
              return 'icons-bundle';
            }
            return 'vendor-libs';
          }
          if (normalized.includes('/src/pages/industries/')) {
            return 'chunk-industries';
          }
          if (normalized.includes('/src/pages/digital-intelligence/')) {
            return 'chunk-intelligence';
          }
          if (normalized.includes('/src/pages/cloud-operations/')) {
            return 'chunk-cloud-operations';
          }
          if (normalized.includes('/src/pages/cloud/')) {
            return 'chunk-cloud';
          }
          if (normalized.includes('/src/pages/about/')) {
            return 'chunk-about';
          }
          if (normalized.includes('/src/pages/ai/')) {
            return 'chunk-ai-products';
          }
          if (normalized.includes('/src/pages/transformation/')) {
            return 'chunk-transformation';
          }
          if (normalized.includes('/src/pages/technology/')) {
            return 'chunk-technology';
          }
          if (normalized.includes('/src/pages/advisory/')) {
            return 'chunk-advisory';
          }
          if (normalized.includes('/src/pages/experience/')) {
            return 'chunk-experience';
          }
          if (
            normalized.includes('/src/pages/enterprise-products/') ||
            normalized.includes('IntelligencePage') ||
            normalized.includes('ManagementPage') ||
            normalized.includes('Page.tsx') && !normalized.includes('HomePage.tsx')
          ) {
            return 'chunk-subpages';
          }
        },
      },
    },
  },
});
