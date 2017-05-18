// Staging config. Also the default config that prod and dev are based off of.

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const path = require('path');
const webpack = require('webpack');

require('babel-polyfill');

const entryFiles = {
  'no-react': './src/js/no-react-entry.js',
};

const configGenerator = () => {
  var filesToBuild = entryFiles; // eslint-disable-line no-var
  filesToBuild.vendor = [
    './src/js/common/polyfills',
    'history',
    'jquery',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-thunk',
    'raven-js'
  ];
  const baseConfig = {
    entry: filesToBuild,
    output: {
      path: path.join(__dirname, '../build/development/generated'),
      publicPath: '/generated/',
      filename: '[name].entry.js',
      chunkFilename: '[name].entry.js'
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
          test: /foundation\.js$/,
          use: {
            loader: 'imports-loader?this=>window',
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
                    bourbon,
                    neat,
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
          test: /\.json$/,
          use: {
            loader: 'json-loader'
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
        modernizr$: path.resolve(__dirname, './modernizrrc'),
        jquery: 'jquery/src/jquery'
      },
      extensions: ['*', '.js', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: 'development',
        __SAMPLE_ENABLED__: (process.env.SAMPLE_ENABLED === 'true'),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          API_PORT: (process.env.API_PORT || 3000),
          WEB_PORT: (process.env.WEB_PORT || 3333),
          API_URL: process.env.API_URL ? JSON.stringify(process.env.API_URL) : null,
          BASE_URL: process.env.BASE_URL ? JSON.stringify(process.env.BASE_URL) : null,
        }
      }),

      // See http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),

      new ExtractTextPlugin({
        filename: '[name].css'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks: Infinity
      }),
    ],
  };


  baseConfig.devtool = '#eval-source-map';
  return baseConfig;
};

module.exports = configGenerator;
