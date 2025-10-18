import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  // @ts-expect-error - Vitest extends Vite config
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': '/src/app',
    },
  },
});
