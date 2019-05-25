const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const fm = require('gray-matter');

module.exports = function mdToApi(options = { source: 'src/content', target: 'public/content' }) {
    const { source, target } = options;
    fs.ensureDir(target);
    let finalBlob = [];
    return {
        name: 'md-to-api',
        async generateBundle(stuff) {
            return new Promise(async (resolve, reject) => {
                let files;
                try {
                    files = await fs.readdir(source);
                } catch (err) {
                    reject(err);
                }

                files = files.filter(file => /\.md$/.exec(file));

                let loop = new Promise((resolve, reject) => {
                    files.forEach(async (file, i) => {
                        const sourcePath = path.resolve(source, file);
                        const content = await fs.readFile(sourcePath);

                        let parsed = fm(content);
                        parsed.content = marked(parsed.content);

                        let destPath = path.resolve(target, parsed.data.slug + '.json');
                        const written = await fs.writeFile(destPath, JSON.stringify(parsed));

                        finalBlob.push(parsed.data);

                        if (i === (files.length - 1)) {
                            resolve();
                        }
                    });
                });

                loop.then(() => { resolve() });
            });
        },
        async writeBundle() {
            return new Promise(async (resolve, reject) => {
                finalBlob.sort((a, b) => a.date < b.date ? 1 : -1);
                const blobPath = path.resolve(target, '__blog-blob.json');
                const written = await fs.writeFile(blobPath, JSON.stringify(finalBlob));
                resolve();
            });
        }
    };
}
