const fs = require('fs');
const path = require('path');
const { table } = require('table');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
// const resolve = require('esbuild-plugin-resolve');

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
  const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/);
  const dirnamePlugin = {
    name: 'dirname',

    setup(build) {
      // eslint-disable-next-line consistent-return
      build.onLoad({ filter: /.js?$/ }, ({ path: filePath }) => {
        if (!filePath.match(nodeModules)) {
          const regex = /.*\/vets-website\/(.+)/;
          const [, relativePath] = filePath.match(regex);
          let contents = fs.readFileSync(filePath, 'utf8');
          const dirname = path.dirname(relativePath);
          const injectedStuff = `const __dirname = '${dirname.replace(
            'src/',
            '',
          )}';`;
          contents = `${injectedStuff}\n\n${contents}`;
          return {
            contents,
            loader: 'jsx',
          };
        }
      });
    },
  };

  // eslint-disable-next-line no-useless-escape, prettier/prettier
  const nodeModules2 = new RegExp(/^(?:.*[\\\/])?node_modules\/url-search-params(?:[\\\/].*)?$/);
  const dirnamePlugin2 = {
    name: 'dirname2',

    setup(build) {
      // eslint-disable-next-line consistent-return
      build.onLoad({ filter: /.js?$/ }, ({ path: filePath }) => {
        if (filePath.match(nodeModules2)) {
          let contents = fs.readFileSync(filePath, 'utf8');
          contents = ` `;
          return {
            contents,
            loader: 'jsx',
          };
        }
      });
    },
  };

  function intercept (build, moduleName, moduleTarget) {
    const filter = new RegExp('^' + moduleName + '/' + '(?:\\/.*)?$');
    console.log(filter);
    console.log(filter);
    console.log(filter);
    console.log(filter);
  
    build.onResolve({ filter }, async (args) => {
      if (args.resolveDir === '') {
        return;
      }
  
      return {
        path: args.path,
        namespace: 'esbuild-resolve',
        pluginData: {
          resolveDir: args.resolveDir,
          moduleName
        }
      };
    });
  
    build.onLoad({ filter, namespace: 'esbuild-resolve' }, async (args) => {
      const importerCode = `
        export * from '${args.path.replace(args.pluginData.moduleName, moduleTarget)}';
      `;
      return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
    });
  }
  
  const EsbuildPluginResolve = (options) => ({
    name: 'esbuild-resolve',
    setup: (build) => {
      for (const moduleName of Object.keys(options)) {
        intercept(build, moduleName, options[moduleName]);
      }
    }
  });

  const plugins = [
    dirnamePlugin,
    dirnamePlugin2,
    EsbuildPluginResolve({
      'platform': path.join(__dirname, '..', '..', '..', '..', '..', '..', 'src', 'platform'),
      '~/platform': path.join(__dirname, '..', '..', '..', '..', '..', '..', 'src', 'platform'),
      site: path.join(__dirname, '..', '..', '..', '..', '..', '..', 'src', 'site'),
      applications: path.join(__dirname, '..', '..', '..', '..', '..', '..', 'src', 'applications'),
    }),
  ];

  const bundler = createBundler({
    // entryPoints: ['src/**/*.cypress.spec.js*'],
    loader: { '.js': 'jsx' },
    format: 'cjs',
    bundle: true,
    external: ['web-components/react-bindings', '@@vap-svc/util/local-vapsvc'],
    banner: { js: `function require(a) { return a; };` },
    define: {
      __BUILDTYPE__: '"vagovprod"',
      __API__: '""',
      __REGISTRY__: JSON.stringify(appRegistry),
      'process.env.NODE_ENV': '"production"',
      'process.env.BUILDTYPE': '"production"',
    },
    plugins: plugins,
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
