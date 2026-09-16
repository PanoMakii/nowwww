import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      svg: {
        plugins: [
          { name: 'preset-default' },
          { name: 'removeViewBox' },
        ],
      },
    }),
    visualizer({
      open: true,
      filename: 'bundle-report.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react/') || id.includes('react/index')) {
              return 'vendor-react';
            }
            // ReactDOM
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Motion utilities (used by framer-motion)
            if (id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'vendor-motion';
            }
            // Three.js – split further
            if (id.includes('three')) {
              if (id.includes('three/src') || id.includes('three/build')) {
                return 'vendor-three-core';
              }
              if (id.includes('three/addons')) {
                return 'vendor-three-addons';
              }
              return 'vendor-three';
            }
            // @react-three/fiber
            if (id.includes('@react-three/fiber')) {
              return 'vendor-r3f';
            }
            // @react-three/drei
            if (id.includes('@react-three/drei')) {
              return 'vendor-r3f-drei';
            }
            // Lucide Icons
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: true,
  },
});