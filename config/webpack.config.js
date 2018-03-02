// Staging config. Also the default config that prod and dev are based off of.

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const bourbon = require('bourbon').includePaths;
// const neat = require('bourbon-neat').includePaths;
const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');

require('babel-polyfill');

const timestamp = new Date().getTime();

const entryFiles = {
  '1990-edu-benefits': './src/js/edu-benefits/1990/edu-benefits-entry.jsx',
  '1990e-edu-benefits': './src/js/edu-benefits/1990e/edu-benefits-entry.jsx',
  '1990n-edu-benefits': './src/js/edu-benefits/1990n/edu-benefits-entry.jsx',
  '1995-edu-benefits': './src/js/edu-benefits/1995/edu-benefits-entry.jsx',
  '5490-edu-benefits': './src/js/edu-benefits/5490/edu-benefits-entry.jsx',
  '5495-edu-benefits': './src/js/edu-benefits/5495/edu-benefits-entry.jsx',
  '526EZ-claims-increase': './src/js/disability-benefits/526EZ/form-entry.jsx',
  'claims-status': './src/js/claims-status/claims-status-entry.jsx',
  'discharge-upgrade-instructions': './src/js/discharge-wizard/discharge-wizard-entry.jsx',
  'health-records': './src/js/health-records/health-records-entry.jsx',
  'id-card-beta': './src/js/id-card-beta/id-card-beta-entry.jsx',
  'no-react': './src/js/no-react-entry.js',
  'post-911-gib-status': './src/js/post-911-gib-status/post-911-gib-status-entry.jsx',
  'pre-need': './src/js/pre-need/pre-need-entry.jsx',
  'user-profile': './src/js/user-profile/user-profile-entry.jsx',
  'veteran-id-card': './src/js/veteran-id-card/veteran-id-card-entry.jsx',
  auth: './src/js/auth/auth-entry.jsx',
  burials: './src/js/burials/burials-entry.jsx',
  facilities: './src/js/facility-locator/facility-locator-entry.jsx',
  gi: './src/js/gi/gi-entry.jsx',
  hca: './src/js/hca/hca-entry.jsx',
  letters: './src/js/letters/letters-entry.jsx',
  messaging: './src/js/messaging/messaging-entry.jsx',
  pensions: './src/js/pensions/pensions-entry.jsx',
  rx: './src/js/rx/rx-entry.jsx',
  verify: './src/js/login/verify-entry.jsx',
  'chapter31-vre': './src/js/vre/chapter31/chapter31-entry.jsx',
  'chapter36-vre': './src/js/vre/chapter36/chapter36-entry.jsx',
  'vic-v2': './src/js/vic-v2/veteran-id-card-entry.jsx',
  style: './src/sass/style.scss'
};

const configGenerator = (options) => {
  var filesToBuild = entryFiles; // eslint-disable-line no-var
  if (options.entry) {
    filesToBuild = _.pick(entryFiles, options.entry.split(',').map(x => x.trim()));
  }
  filesToBuild.vendor = [
    './src/js/common/polyfills',
    'history',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-thunk',
    'raven-js'
  ];
  const baseConfig = {
    mode: 'development',
    entry: filesToBuild,
    output: {
      path: path.join(__dirname, `../build/${options.buildtype}/generated`),
      publicPath: '/generated/',
      filename: (options.buildtype === 'development') ? '[name].entry.js' : `[name].entry.[chunkhash]-${timestamp}.js`,
      chunkFilename: (options.buildtype === 'development') ? '[name].entry.js' : `[name].entry.[chunkhash]-${timestamp}.js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Speed up compilation.
              cacheDirectory: '.babelcache'

              // Also see .babelrc
            }
          }
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['react'],
              // Speed up compilation.
              cacheDirectory: '.babelcache'

              // Also see .babelrc
            }
          }
        },
        {
          test: /modernizrrc/,
          use: {
            loader: 'modernizr-loader'
          }
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader' },
              { loader: 'resolve-url-loader' },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [
                    // bourbon,
                    // neat,
                    '~/uswds/src/stylesheets&sourceMap'
                  ],
                  sourceMap: true,
                }
              }
            ],
          })
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: {
            loader: 'url-loader?limit=10000!img?progressive=true&-minimize'
          }
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader'
          }
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader'
          }
        },
        {
          test: /react-jsonschema-form\/lib\/components\/(widgets|fields\/ObjectField|fields\/ArrayField)/,
          exclude: [
            /widgets\/index\.js/,
            /widgets\/TextareaWidget/
          ],
          use: {
            loader: 'null-loader'
          }
        }
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      alias: {
        modernizr$: path.resolve(__dirname, './modernizrrc')
      },
      extensions: ['.js', '.jsx']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(options.buildtype),
        __SAMPLE_ENABLED__: (process.env.SAMPLE_ENABLED === 'true'),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          API_PORT: (process.env.API_PORT || 3000),
          WEB_PORT: (process.env.WEB_PORT || 3333),
          API_URL: process.env.API_URL ? JSON.stringify(process.env.API_URL) : null,
          BASE_URL: process.env.BASE_URL ? JSON.stringify(process.env.BASE_URL) : null,
        }
      }),

      new ExtractTextPlugin({
        filename: (options.buildtype === 'development') ? '[name].css' : `[name].[contenthash]-${timestamp}.css`
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   filename: (options.buildtype === 'development') ? 'vendor.js' : `vendor.[chunkhash]-${timestamp}.js`,
      //   minChunks: Infinity
      // }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ],
  };

  if (options.buildtype === 'production' || options.buildtype === 'staging') {
    let sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/staging.vets.gov';
    if (options.buildtype === 'production') {
      sourceMap = 'https://s3-us-gov-west-1.amazonaws.com/www.vets.gov';
    }
    baseConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
      append: `\n//# sourceMappingURL=${sourceMap}/generated/[url]`,
      filename: '[file].map',
    }));
    baseConfig.module.rules.push({
      test: /debug\/PopulateVeteranButton/,
      use: {
        loader: 'null-loader'
      }
    });
    baseConfig.module.rules.push({
      test: /debug\/PerfPanel/,
      use: {
        loader: 'null-loader'
      }
    });
    baseConfig.module.rules.push({
      test: /debug\/RoutesDropdown/,
      use: {
        loader: 'null-loader'
      }
    });

    baseConfig.plugins.push(new WebpackMd5Hash());
    baseConfig.plugins.push(new ManifestPlugin({
      fileName: 'file-manifest.json'
    }));
    baseConfig.plugins.push(new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    }));
    baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: { warnings: false },
      comments: false,
      sourceMap: true,
      minimize: true,
    }));
    // baseConfig.mode = 'production';
  } else {
    baseConfig.devtool = '#eval-source-map';
  }

  if (options.analyzer) {
    baseConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true
    }));
  }

  return baseConfig;
};

module.exports = configGenerator;
