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
  if (process.env.CODE_COVERAGE === 'true') {
    require('@cypress/code-coverage/task')(on, config);
    on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
  }

  let appRegistry;
  if (fs.existsSync('../content-build/src/applications/registry.json')) {
    // eslint-disable-next-line import/no-unresolved
    appRegistry = require('../../../../../../../content-build/src/applications/registry.json');
  } else if (fs.existsSync('content-build/src/applications/registry.json')) {
    // eslint-disable-next-line import/no-unresolved
    appRegistry = require('../../../../../../content-build/src/applications/registry.json');
  } else {
    const REMOTE_CONTENT_BUILD_REGISTRY =
      'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/master/src/applications/registry.json';

    const response = await fetch(REMOTE_CONTENT_BUILD_REGISTRY);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${REMOTE_CONTENT_BUILD_REGISTRY}.\n\n${
          response.status
        }:
          ${response.statusText}`,
      );
    }

    const registryContents = await response.text();
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

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      const originalArgs = args;
      // NOTE(nms): https://peter.sh/experiments/chromium-command-line-switches/
      // NOTE(nms): disable-gpu is the only truly necessary argument to strip
      args = args.filter(
        arg =>
          !/disable-gpu|disable-setuid-sandbox|no-sandbox|enable-automation/.test(
            arg,
          ),
      );
      const strippedArgs = originalArgs.filter(arg => !args.includes(arg));
      // strippedArgs.length ? console.log('stripped args: ', strippedArgs) : console.log('args: ', originalArgs);
      args.push('--enable-logging');
      args.push('--use-gl=swiftshader');
      args.push('--ignore-gpu-blacklist');
      // args.push('--start-fullscreen');
      args.push('--user-data-dir=./cypress/chromium-profile');
    } else if (browser.family === 'electron') {
      // NOTE(nms): https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
      // NOTE(nms): https://github.com/electron/electron/blob/v5.0.10/docs/api/browser-window.md#new-browserwindowoptions
      // NOTE(nms): one or more of these may work for additionalArguments, supplied to Chromium's renderer process
      args.webPreferences.additionalArguments = [
        ...(args.webPreferences.additionalArguments || []),
        '--disable-gpu', // Disables GPU hardware acceleration. If software renderer is not in place, then the GPU process won't launch.
        // '--use-gl=swiftshader', // Select which implementation of GL the GPU process should use. Options are: desktop: whatever desktop OpenGL the user has installed (Linux and Mac default). egl: whatever EGL / GLES2 the user has installed (Windows default - actually ANGLE). swiftshader: The SwiftShader software renderer.
        // '--override-use-software-gl-for-tests', // Forces the use of software GL instead of hardware gpu.
        '--use-gpu-in-tests', // Use hardware gpu, if available, for tests.
      ];
    }
  });

  return config;
};
