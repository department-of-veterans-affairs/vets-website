// Staging config. Also the default config that prod and dev are based off of.

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');

require('babel-polyfill');

const entryFiles = {
  'disability-benefits': './src/js/disability-benefits/disability-benefits-entry.jsx',
  'edu-benefits': './src/js/edu-benefits/edu-benefits-entry.jsx',
  facilities: './src/js/facility-locator/facility-locator-entry.jsx',
  hca: './src/js/hca/hca-entry.jsx',
  messaging: './src/js/messaging/messaging-entry.jsx',
  rx: './src/js/rx/rx-entry.jsx',
  'no-react': './src/js/no-react-entry.js',
  'user-profile': './src/js/user-profile/user-profile-entry.jsx',
  auth: './src/js/auth/auth-entry.jsx'
};

const configGenerator = (options) => {
  var filesToBuild = entryFiles; // eslint-disable-line no-var
  if (options.entry) {
    filesToBuild = _.pick(entryFiles, options.entry.split(',').map(x => x.trim()));
  }
  const baseConfig = {
    entry: filesToBuild,
    output: {
      path: path.join(__dirname, `../build/${options.buildtype}/generated`),
      publicPath: '/generated/',
      filename: '[name].entry.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            // Speed up compilation.
            cacheDirectory: '.babelcache'

            // Also see .babelrc
          }
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['react'],
            // Speed up compilation.
            cacheDirectory: '.babelcache'

            // Also see .babelrc
          }
        },
        {
          // components.js is effectively a hand-rolled bundle.js. Break it apart.
          test: /components\.js$/,
          loader: 'imports?this=>window'
        },
        {
          test: /foundation\.js$/,
          loader: 'imports?this=>window'
        },
        {
          test: /modernizrrc/,
          loader: 'modernizr'
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style-loader', `css!resolve-url!sass?includePaths[]=${bourbon}&includePaths[]=${neat}&includePaths[]=~/uswds/src/stylesheets&sourceMap`)
        },
        { test: /\.(jpe?g|png|gif)$/i,
          loader: 'url?limit=10000!img?progressive=true&-minimize'
        },
        { test: /\.svg/, loader: 'svg-url' },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&minetype=application/font-woff'
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader'
        }
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      alias: {
        modernizr$: path.resolve(__dirname, './modernizrrc'),
        jquery: 'jquery/src/jquery'
      },
      extensions: ['', '.js', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(options.buildtype),
        __ALL_CLAIMS_ENABLED__: (options.buildtype === 'development' || process.env.ALL_CLAIMS_ENABLED === 'true'),
        __SAMPLE_ENABLED__: (process.env.SAMPLE_ENABLED === 'true'),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          API_PORT: (process.env.API_PORT || 4000),
          WEB_PORT: (process.env.WEB_PORT || 3333),
        }
      }),

      // See http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),

      new ExtractTextPlugin('[name].css'),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
  };

  if (options.buildtype === 'production') {
    baseConfig.devtool = '#source-map';
    baseConfig.module.loaders.push({
      test: /debug\/PopulateVeteranButton/,
      loader: 'null'
    });
    baseConfig.module.loaders.push({
      test: /debug\/PerfPanel/,
      loader: 'null'
    });
    baseConfig.module.loaders.push({
      test: /debug\/RoutesDropdown/,
      loader: 'null'
    });

    baseConfig.plugins.push(new webpack.optimize.DedupePlugin());
    baseConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
    baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
  } else {
    baseConfig.devtool = '#eval-source-map';
  }


  return baseConfig;
};

module.exports = configGenerator;
