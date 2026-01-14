import { defineConfig } from 'vite';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      name: 'CWDComments',
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['umd'],
      fileName: (format) => `cwd-comments.js`
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
