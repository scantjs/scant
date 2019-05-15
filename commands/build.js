const rollup = require('rollup');
const path = require('path');
const rollupConfig = require('./../config/rollup.config.js');

exports.command = 'build';

exports.desc = 'Build your site.';

exports.builder = {};

exports.handler = async () => {
    const directory = path.resolve('.');
    const userConfig = require(path.join(directory, 'scant.config.js'));

    // add current directory to config object
    userConfig.directory = directory;

    // default directory for site is src
    userConfig.sourceDir = (() => {
        return userConfig.sourceDir
        ? path.join(userConfig.directory, userConfig.sourceDir)
        : path.join(userConfig.directory, 'src');
    })();

    // default directory for compiled site is public
    userConfig.buildDir = (() => {
        return userConfig.buildDir
        ? path.join(userConfig.directory, userConfig.buildDir)
        : path.join(userConfig.directory, 'public');
    })();

    await rollupBuild();
    console.log('done');
};

async function rollupBuild() {
    const opts = {
        input: {
            input: rollupConfig.input,
            plugins: rollupConfig.plugins,
        },
        output: {
            output: rollupConfig.output,
        }
    };

    const bundle = await rollup.rollup(opts.input);
    await bundle.write(opts.output);
}
