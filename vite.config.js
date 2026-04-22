import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'SamifyWidget',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    outDir: '.',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
