import { defineConfig } from 'vite';
import { resolve } from 'path';
import yaml from '@rollup/plugin-yaml';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
	esbuild: {
		supported: {
			'top-level-await': true //browsers can handle top-level-await features
		}
	},
	plugins: [
		yaml(),
		handlebars({
			partialDirectory: resolve(__dirname, 'partials')
		})
	]
});
