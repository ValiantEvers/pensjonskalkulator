import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploys under evers.no/pensjonskalkulator/.
// Standalone build-output havner i ./dist/. (Produksjonssiden bygger fra en
// in-tree-kopi i site-repoet med outDir satt til site-mappens deploy-sti.)
export default defineConfig({
  base: '/pensjonskalkulator/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
})
