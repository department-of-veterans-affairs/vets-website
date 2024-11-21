const fs = require('fs');
const { table } = require('table');
const path = require('path');
const fetch = require('node-fetch');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

const tableConfig = {
  columns: {
    0: { width: 15 },
    1: { width: 85 },
  },
};

module.exports = async (on, config) => {
  const registerCodeCoverageTasks = require('@cypress/code-coverage/task');

  if (process.env.CODE_COVERAGE === 'true') {
    on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
    registerCodeCoverageTasks(on, config);

    // on('after:run', async () => {
    //   const execa = require('execa');
    //   try {
    //     // Use execa to run the NYC coverage report command
    //     await execa('nyc', ['report', '--reporter=html'], {
    //       stdio: 'inherit',
    //     });
    //     console.log('Coverage report generated successfully.');
    //   } catch (error) {
    //     console.error('Error generating coverage report:', error);
    //   }
    // });
  }

  let appRegistry;
  const REMOTE_CONTENT_BUILD_REGISTRY =
    'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/main/src/applications/registry.json';
  async function fetchRegistry() {
    return fetch(REMOTE_CONTENT_BUILD_REGISTRY);
  }

  async function getRegistryContents(response) {
    return response.text();
  }

  if (fs.existsSync('../content-build/src/applications/registry.json')) {
    // eslint-disable-next-line import/no-unresolved
    appRegistry = require('../../../../../../../content-build/src/applications/registry.json');
  } else {
    const response = await fetchRegistry();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${REMOTE_CONTENT_BUILD_REGISTRY}.\n\n${
          response.status
        }:
          ${response.statusText}`,
      );
    }

    const registryContents = await getRegistryContents(response);

    appRegistry = JSON.parse(registryContents);
  }

  // eslint-disable-next-line no-useless-escape
  const cypressPlugin = {
    name: 'cypress',

    setup(build) {
      // eslint-disable-next-line consistent-return
      build.onLoad({ filter: /.js?$/ }, ({ path: filePath }) => {
        // Filter out files in node_modules
        if (!filePath.split(path.sep).includes('node_modules')) {
          const regex = /.*\/vets-website\/(.+)/;
          const [, relativePath] = filePath.match(regex);
          let contents = fs.readFileSync(filePath, 'utf8');
          const dirname = path.dirname(relativePath);
          // Generate __dirname for test files
          const injectedDir = `const __dirname = '${dirname.replace(
            'src/',
            '',
          )}';`;
          // Inject __dirname and fix imports
          contents = `${injectedDir}\n\n${contents
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

  on('task', {
    readFileMaybe(filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8');
      }
      return null;
    },
  });

  return config;
};
