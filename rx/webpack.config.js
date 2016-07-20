var path = require('path');
var webpack = require('webpack');

var config = {
  entry: "./src/client.js",
  output: {
    path: path.join(__dirname, "public/js/generated"),
    publicPath: "/public/js/generated/",
    filename: "bundle.js"
  },
  devtool: "#source-map",
  devServer: {
    historyApiFallback: true
  },
  module: {
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
//          plugins: ['transform-runtime'],

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
//          plugins: ['transform-runtime'],
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
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./.modernizrrc"),
    },
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_TYPE === "dev"))
    })
  ],
};

module.exports = config;
