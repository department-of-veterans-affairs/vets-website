// Staging config. Also the default config that prod and dev are based off of.
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ENVIRONMENTS = require('../src/site/constants/environments');
const BUCKETS = require('../src/site/constants/buckets');
const generateWebpackDevConfig = require('./webpack.dev.config.js');

const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('./manifest-helpers');
const headerFooterData = require('../src/platform/landing-pages/header-footer-data.json');

require('@babel/polyfill');

const timestamp = new Date().getTime();

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

const globalEntryFiles = {
  polyfills: getAbsolutePath('src/platform/polyfills/preESModulesPolyfills.js'),
  style: getAbsolutePath('src/platform/site-wide/sass/style.scss'),
  styleConsolidated: getAbsolutePath(
    'src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: [
    getAbsolutePath('src/platform/polyfills'),
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'redux-thunk',
    '@sentry/browser',
  ],
};

/**
 * Get a list of all the entry points.
 *
 * If the `entry` CLI argument is passed, only the specified
 * application entries are built.
 */
function getEntryPoints(entry) {
  const manifests = getAppManifests();
  let manifestsToBuild = manifests;
  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    manifestsToBuild = manifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }

  return getWebpackEntryPoints(manifestsToBuild);
}

/**
 * The dev server requires settings.js for building the
 * redirects. This loads the settings for use in the watch commands.
 *
 * This does NOT recreate the full settings like
 * create-build-settings.js does. This is currently only meant to fill
 * out the URL rewrites for the webpack-dev-server.
 *
 * @return {Object} settings
 */
function getSettings() {
  const settings = {};
  const manifests = getAppManifests();
  settings.applications = manifests
    .map(
      m =>
        // Some manifests don't have a rootUrl
        m.rootUrl && {
          contentProps: [
            {
              path: path.join('.', m.rootUrl),
            },
          ],
        },
    )
    // Filter out empty entries
    .filter(a => !!a);

  return settings;
}

module.exports = env => {
  const buildOptions = Object.assign(
    {
      api: '',
      buildtype: 'localhost',
      host: 'localhost',
      port: 3001,
      watch: false,
    },
    env,
  );
  // Assign additional defaults which reference other properties
  Object.assign(buildOptions, {
    destination: path.resolve(
      __dirname,
      '../',
      'build',
      buildOptions.buildtype,
    ),
  });
  buildOptions.settings = getSettings();

  const apps = getEntryPoints(buildOptions.entry);
  const entryFiles = Object.assign({}, apps, globalEntryFiles);
  const isOptimizedBuild = [
    ENVIRONMENTS.VAGOVSTAGING,
    ENVIRONMENTS.VAGOVPROD,
  ].includes(buildOptions.buildtype);

  // enable css sourcemaps for all non-localhost builds
  // or if build options include local-css-sourcemaps or entry
  const enableCSSSourcemaps =
    buildOptions.buildtype !== ENVIRONMENTS.LOCALHOST ||
    buildOptions['local-css-sourcemaps'] ||
    !!buildOptions.entry;

  const outputPath = `${buildOptions.destination}/generated`;

  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: outputPath,
      publicPath: '/generated/',
      filename: !isOptimizedBuild
        ? '[name].entry.js'
        : `[name].entry.[chunkhash]-${timestamp}.js`,
      chunkFilename: !isOptimizedBuild
        ? '[name].entry.js'
        : `[name].entry.[chunkhash]-${timestamp}.js`,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Speed up compilation.
              cacheDirectory: '.babelcache',
              // Also see .babelrc
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                minimize: isOptimizedBuild,
                sourceMap: enableCSSSourcemaps,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')],
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          // if we want to minify these images, we could add img-loader
          // but it currently only would apply to three images from uswds
          test: /\.(jpe?g|png|gif)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader?limit=1024',
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 7000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /react-jsonschema-form\/lib\/components\/(widgets|fields\/ObjectField|fields\/ArrayField)/,
          exclude: [/widgets\/index\.js/, /widgets\/TextareaWidget/],
          use: {
            loader: 'null-loader',
          },
        },
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              beautify: false,
              comments: false,
            },
            warnings: false,
          },
          // cache: true,
          parallel: 3,
          sourceMap: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          // this needs to be "vendors" to overwrite a default group
          vendors: {
            chunks: 'all',
            test: 'vendor',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(buildOptions.buildtype),
        __API__: JSON.stringify(buildOptions.api),
      }),

      new MiniCssExtractPlugin({
        filename: !isOptimizedBuild
          ? '[name].css'
          : `[name].[contenthash]-${timestamp}.css`,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'file-manifest.json',
      }),
    );
  } else {
    // Add landing pages for local development with the watch task
    baseConfig.plugins = baseConfig.plugins.concat(
      getAppManifests()
        .map(m => {
          // There's no place to create a landing page at
          if (!m.rootUrl) return undefined;

          const landingPagePath = path.join(
            outputPath,
            '../',
            m.rootUrl,
            'index.html',
          );

          // Only create a new landing page if one doesn't already exist from a
          // previous build. This is useful for using the content build page for
          // testing.
          if (fs.existsSync(landingPagePath)) return undefined;

          return new HtmlWebpackPlugin({
            filename: landingPagePath,
            template:
              m.landingPageDevTemplate ||
              'src/platform/landing-pages/dev-template.ejs',
            // Pass data to the tempates
            templateParameters: {
              // Everything from the manifest file
              ...m,
              // With some defaults
              loadingMessage:
                m.loadingMessage ||
                'Please wait while we load the application for you.',
              entryName: m.entryName || 'static-pages',
              // TODO: Get this placeholder data from another file
              headerFooterData,
            },
            // Don't inject all the assets into all the landing pages
            // The assets we want are referenced in the template itself
            inject: false,
          });
        })
        .filter(p => p),
    );
  }

  if (isOptimizedBuild) {
    const bucket = BUCKETS[buildOptions.buildtype];

    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${bucket}/generated/[url]`,
        filename: '[file].map',
      }),
    );

    baseConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
    baseConfig.mode = 'production';
  } else {
    baseConfig.devtool = '#eval-source-map';

    // The eval-source-map devtool doesn't seem to work for CSS, so we
    // add a separate plugin for CSS source maps.
    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        test: /\.css$/,
      }),
    );
  }

  if (buildOptions.analyzer) {
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
      }),
    );
  }

  return baseConfig;
};
