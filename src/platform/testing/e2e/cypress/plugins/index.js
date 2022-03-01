const fs = require('fs');
const { table } = require('table');
const { filelocPlugin } = require('esbuild-plugin-fileloc');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

const tableConfig = {
  columns: {
    0: { width: 15 },
    1: { width: 85 },
  },
};

module.exports = async on => {
  const bundler = createBundler({
    loader: { '.js': 'jsx' },
    // format: 'cjs',
    bundle: true,
    define: {
      __BUILDTYPE__: '"vagovprod"',
      __API__: '""',
      'process.env.NODE_ENV': '"production"',
    },
    plugins: [filelocPlugin()],
    platform: 'node',
    target: ['esnext', 'node14'],
    // banner: {
    //   js:
    //     "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);",
    // },
    // footer: {
    //   js: [
    //     `}`
    //   ].join('\n'),
    // },
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
