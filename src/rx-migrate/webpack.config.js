var path = require('path');
var webpack = require('webpack');
var config = require('./config');

module.exports = {
  entry: "./src/client.js",
  output: {
    path: path.join(__dirname, "public/js/generated"),
    publicPath: "/public/js/generated/",
    filename: "bundle.js"
  },
  devtool: "#source-map",
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: `https://${config.api.host}${config.api.path}`,
        auth: config.api.auth,
        rewrite: function rewrite(req) {
          req.url = req.url.replace(/^\/api/, '');
          req.headers.host = config.api.host;
        }
      }
    }
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          // es2015 is current name for the es6 settings.
          presets: ['es2015'],

          // Share polyfills between files.
          // TODO(awong): This is erroring out. Enable later.
          // plugins: ['transform-runtime'],

          // Speed up compilation.
          cacheDirectory: true
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          // es2015 is current name for the es6 settings.
          presets: ['es2015', 'react'],

          // Share polyfills between files.
          // TODO(awong): This is erroring out. Enable later.
          // plugins: ['transform-runtime'],
          plugins: [
            ['react-transform', {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                },
              ],
            }],
          ],
          // Speed up compilation.
          cacheDirectory: true
        }
      },
      {
        test: /\.modernizrrc/,
        loader: "modernizr"
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./.modernizrrc"),
    },
    extensions: ['', '.js', '.jsx']
  }
};
