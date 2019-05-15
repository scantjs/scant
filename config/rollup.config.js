const clear = require('rollup-plugin-clear');
const svelte = require('rollup-plugin-svelte');
const copy = require('rollup-plugin-copy');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
const livereload = require('rollup-plugin-livereload');
const mdToApi = require('../lib/md-to-api');

const production = !process.env.ROLLUP_WATCH;

module.exports = {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'esm',
		name: 'app',
		dir: 'public'
	},
	plugins: [
        clear({
            targets: ['public']
        }),
        mdToApi(),
        copy({
            targets: {
                'src/assets': 'public/assets',
                'src/index.html': 'public/index.html',
                'node_modules/shimport/index.js': 'public/assets/shimport.js',
            },
        }),
		svelte({
			dev: !production,
			css: css => {
				css.write('public/bundle.css');
			},
		}),
		resolve(),
		commonjs(),
		production && terser()
	]
};
