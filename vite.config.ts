import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import type { Plugin } from 'vite'
import { resolve } from 'path'
import { build as esbuild } from 'esbuild'

function contentScriptBundle(): Plugin {
  return {
    name: 'focustube-content-script-bundle',
    apply: 'build',
    async closeBundle() {
      await esbuild({
        entryPoints: [resolve(__dirname, 'src/entrypoints/content.ts')],
        outfile: resolve(__dirname, 'dist/content.js'),
        bundle: true,
        format: 'iife',
        platform: 'browser',
        target: 'chrome114',
        minify: true,
        legalComments: 'none'
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), contentScriptBundle()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        background: resolve(__dirname, 'src/entrypoints/background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  }
})
