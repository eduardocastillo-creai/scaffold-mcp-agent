import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  rollupOptions: {},
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'init.js',
          dest: ''
        }
      ]
    })
  ],
  define: {
    _global: ({}),
    global: "globalThis",
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`},
  build: {
    sourcemap: false,
    outDir: 'dist/lib',
    lib: {
      name: 'Chatbot',
      formats: ['umd'],
      entry: path.resolve(__dirname, 'main.tsx'),
      fileName: (format) => `chatbot.${format}.js`
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.gif']
  }
});
