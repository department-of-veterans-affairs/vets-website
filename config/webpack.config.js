// Staging config. Also the default config that prod and dev are based off of.
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

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

const configGenerator = (options, apps) => {
  const entryFiles = Object.assign({}, apps, globalEntryFiles);
  const baseConfig = {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: `${options.destination}/generated`,
      publicPath: '/generated/',
      filename: ['development', 'vagovdev'].includes(options.buildtype)
        ? '[name].entry.js'
        : `[name].entry.[chunkhash]-${timestamp}.js`,
      chunkFilename: ['development', 'vagovdev'].includes(options.buildtype)
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
                  minimize: ['production', 'staging', 'preview'].includes(
                    options.buildtype,
                  ),
                },
              },
              { loader: 'sass-loader' },
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
        __BUILDTYPE__: JSON.stringify(options.buildtype),
        'process.env': {
          API_PORT: process.env.API_PORT || 3000,
          WEB_PORT: process.env.WEB_PORT || 3333,
          API_URL: process.env.API_URL
            ? JSON.stringify(process.env.API_URL)
            : null,
          BASE_URL: process.env.BASE_URL
            ? JSON.stringify(process.env.BASE_URL)
            : null,
        },
      }),

      new ExtractTextPlugin({
        filename: ['development', 'vagovdev'].includes(options.buildtype)
          ? '[name].css'
          : `[name].[contenthash]-${timestamp}.css`,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  };

  if (
    ['production', 'staging', 'preview', 'vagovstaging'].includes(
      options.buildtype,
    )
  ) {
    let sourceMap = null;

    switch (options.buildtype) {
      case 'production':
        sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/www.vets.gov';
        break;

      case 'staging':
        sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/staging.vets.gov';
        break;

      case 'vagovstaging':
        sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/staging.va.gov';
        break;

      case 'preview':
      default:
        sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/preview.va.gov';
    }

    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${sourceMap}/generated/[url]`,
        filename: '[file].map',
      }),
    );

    baseConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
    baseConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'file-manifest.json',
      }),
    );
    baseConfig.mode = 'production';
  } else {
    baseConfig.devtool = '#eval-source-map';
  }

  if (options.analyzer) {
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
