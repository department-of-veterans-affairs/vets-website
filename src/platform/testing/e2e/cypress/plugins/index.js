const fs = require('fs');
const path = require('path');
const { table } = require('table');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

const tableConfig = {
  columns: {
    0: { width: 15 },
    1: { width: 85 },
  },
};

module.exports = async on => {
  const appRegistry = require('../../../../../../../content-build/src/applications/registry.json');
  const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/);
  const dirnamePlugin = {
    name: 'dirname',

    setup(build) {
      build.onLoad({ filter: /.js?$/ }, ({ path: filePath }) => {
        if (!filePath.match(nodeModules)) {
          const regex = /.*\/vets-website\/(.+)/;
          const [, relativePath] = filePath.match(regex);
          let contents = fs.readFileSync(filePath, 'utf8');
          // const loader = path.extname(filePath).substring(1);
          const dirname = path.dirname(relativePath);
          if (/.+.cypress.spec.js$/.test(filePath)) {
            // console.log('filePath: ', filePath);
            // console.log('dirname: ', dirname);
            // console.log('__dirname: ', __dirname);
            // console.log('contents: ', contents);
            // console.log('loader: ', loader);
          }
          const injectedStuff = `const __dirname = '${dirname.replace('src/','')}';`;
          contents = `${injectedStuff}\n\n${contents}`;
          return {
            contents,
            loader: 'jsx',
          };
        }
      });
    },
  };
  const bundler = createBundler({
    loader: { '.js': 'jsx' },
    format: 'cjs',
    bundle: true,
    define: {
      __BUILDTYPE__: '"vagovprod"',
      __API__: '""',
      __REGISTRY__: JSON.stringify(appRegistry),
      // global: '""',
      'process.env.NODE_ENV': '"production"',
      'process.env.BUILDTYPE': '"production"',
    },
    plugins: [dirnamePlugin],
    platform: 'browser',
    target: ['esnext', 'node14'],
  });
  on('file:preprocessor', bundler);

  on('after:spec', (spec, results) => {
    if (results.stats.failures === 0 && results.video) {
      fs.unlinkSync(results.video);
    }
  });

  on('task', {
    /* eslint-disable no-console */
    log: message => console.log(message) || null,
    table: message => console.log(table(message, tableConfig)) || null,
    /* eslint-enable no-console */
  });
};
