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
  let appRegistry;
  if (process.env.CYPRESS_CI) {
    // eslint-disable-next-line import/no-unresolved
    appRegistry = require('../../../../../../content-build/src/applications/registry.json');
  } else {
    appRegistry = require('../../../../../../../content-build/src/applications/registry.json');
  }
  // eslint-disable-next-line no-useless-escape
  const cypressPlugin = {
    name: 'cypress',

    setup(build) {
      // eslint-disable-next-line consistent-return
      build.onLoad({ filter: /.js?$/ }, ({ path: filePath }) => {
        if (!filePath.split(path.sep).includes('node_modules')) {
          const regex = /.*\/vets-website\/(.+)/;
          const [, relativePath] = filePath.match(regex);
          let contents = fs.readFileSync(filePath, 'utf8');
          const dirname = path.dirname(relativePath);
          const injectedStuff = `const __dirname = '${dirname.replace(
            'src/',
            '',
          )}';`;
          contents = `${injectedStuff}\n\n${contents
            .replace(/~\//g, '')
            .replace(/@@profile/g, 'applications/personalization/profile')}`;
          return {
            contents,
            loader: 'jsx',
          };
        }
      });
    },
  };

  const bundler = createBundler({
    entryPoints: ['src/**/*.cypress.spec.js*'],
    loader: { '.js': 'jsx' },
    format: 'cjs',
    external: [
      'web-components/react-bindings',
      'url-search-params',
      '@@vap-svc/*',
      '~/platform/*',
      'axe-core/*',
    ],
    nodePaths: [path.resolve(__dirname, '../../../../..')],
    banner: { js: `function require(a) { return a; }; var module = {};` },
    define: {
      __BUILDTYPE__: '"vagovprod"',
      __API__: '""',
      __REGISTRY__: JSON.stringify(appRegistry),
      'process.env.NODE_ENV': '"production"',
      'process.env.BUILDTYPE': '"production"',
    },
    plugins: [cypressPlugin],
    platform: 'browser',
    target: ['esnext', 'node14'],
  });
  on('file:preprocessor', bundler);

  on('after:spec', (spec, results) => {
    if (results.stats.failures === 0 && results.video) {
      try {
        fs.unlinkSync(results.video);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('No video generated.');
      }
    }
  });

  on('task', {
    /* eslint-disable no-console */
    log: message => console.log(message) || null,
    table: message => console.log(table(message, tableConfig)) || null,
    /* eslint-enable no-console */
  });
};
