const fs = require('fs');
const path = require('path');

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const aliasPlugin = require('esbuild-plugin-alias');
const { sassPlugin } = require('esbuild-sass-plugin');

// const webpackPreprocessor = require('@cypress/webpack-preprocessor');

const root = path.resolve(__dirname, '../../../../../src');

module.exports = on => {
  // const ENV = 'localhost';

  // Import our own Webpack config.
  // require('../../../../../../config/webpack.config.js')(ENV).then(
  //   webpackConfig => {
  //     const options = {
  //       webpackOptions: {
  //         ...webpackConfig,

  //         // Expose some Node globals.
  //         node: {
  //           __dirname: true,
  //           __filename: true,
  //         },
  //       },
  //     };

  //     on('file:preprocessor', webpackPreprocessor(options));
  //   },
  // );

  const nodeModulesRegex = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;
  const relativePathRegex = /.*\/vets-website\/(.+)/;

  const dirnamePlugin = {
    name: 'dirname',

    setup(build) {
      build.onLoad({ filter: /.js$/ }, ({ path: filePath }) => {
        if (!nodeModulesRegex.test(filePath)) {
          const match = filePath.match(relativePathRegex);
          if (!match) return null;

          const [, relativePath] = match;
          const dirname = path.dirname(relativePath);
          const fileContents = fs.readFileSync(filePath, 'utf8');

          return {
            contents: fileContents.replace('__dirname', `'${dirname}'`),
            loader: 'jsx',
          };
        }

        return null;
      });
    },
  };

  const bundler = createBundler({
    define: {
      __BUILDTYPE__: '"localhost"',
      __API__: null,
      global: 'window',
      process: JSON.stringify({ env: { ...process.env } }, null, 2),
    },
    loader: { '.js': 'jsx' },
    nodePaths: [root],
    plugins: [
      aliasPlugin({
        '~': root,
        '@@vap-svc': path.resolve(root, 'platform/user/profile/vap-svc'),
        '@@profile': path.resolve(root, 'applications/personalization/profile'),
      }),
      sassPlugin(),
      dirnamePlugin,
    ],
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
    table: message => console.table(message) || null,
    /* eslint-enable no-console */
  });
};
