import { fileURLToPath, URL } from 'node:url'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
		  '@': fileURLToPath(new URL('./src', import.meta.url))
		}
	  }	
});
