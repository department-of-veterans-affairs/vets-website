// Staging config. Also the default config that prod and dev are based off of.
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ENVIRONMENTS = require('../src/site/constants/environments');
const BUCKETS = require('../src/site/constants/buckets');

require('babel-polyfill');

const timestamp = new Date().getTime();

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

const globalEntryFiles = {
  styleConsolidated: getAbsolutePath(
    'src/platform/site-wide/sass/style-consolidated.scss',
  ),
  style: getAbsolutePath('src/platform/site-wide/sass/style.scss'),
  polyfills: getAbsolutePath('src/platform/polyfills/preESModulesPolyfills.js'),
  brandConsolidation: getAbsolutePath(
    'src/platform/site-wide/sass/brand-consolidation.scss',
  ),
  vendor: [
    getAbsolutePath('src/platform/polyfills'),
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'redux-thunk',
    'raven-js',
  ],
};

const configGenerator = (buildOptions, apps) => {
  const entryFiles = Object.assign({}, apps, globalEntryFiles);
  const isOptimizedBuild = [
    ENVIRONMENTS.VAGOVSTAGING,
    ENVIRONMENTS.VAGOVPROD,
  ].includes(buildOptions.buildtype);

  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: `${buildOptions.destination}/generated`,
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
          test: /manifest\.js$/,
          exclude: /node_modules/,
          use: {
            loader: path.resolve(__dirname, 'manifest-loader.js'),
          },
        },
        {
          test: /\.js$/,
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
          test: /\.jsx$/,
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isOptimizedBuild,
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: true },
              },
            ],
          }),
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
            loader: 'svg-url-loader',
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
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
        new UglifyJSPlugin({
          uglifyOptions: {
            output: {
              beautify: false,
              comments: false,
            },
            compress: { warnings: false },
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

      new ExtractTextPlugin({
        filename: !isOptimizedBuild
          ? '[name].css'
          : `[name].[contenthash]-${timestamp}.css`,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ManifestPlugin({
        fileName: 'file-manifest.json',
      }),
    ],
  };

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

module.exports = configGenerator;
