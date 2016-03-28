// Staging config. Also the default config that prod and dev are based off of.

var path = require('path');
var webpack = require('webpack');

var config = {
  entry: "./assets/js/entry.js",
  output: {
    path: path.join(__dirname, "assets/js/generated/dev"),
    publicPath: "/assets/js/generated/dev/",
    filename: "bundle.js"
  },
  devtool: '#cheap-module-eval-source-map',
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
          plugins: ['transform-runtime'],

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
          plugins: ['transform-runtime'],

          // Speed up compilation.
          cacheDirectory: true
        }
      },
      {
        // components.js is effectively a hand-rolled bundle.js. Break it apart.
        test: /components\.js$/,
        loader: "imports?this=>window"
      },
      {
        test: /foundation\.js$/,
        loader: "imports?this=>window"
      },
      {
        test: /\.modernizrrc/,
        loader: "modernizr"
      },
      {
        // Loaders are executed bottom to top, right to left. This MUST
        // appear before the \.coffee loader.
        test: /wow\.coffee$/,
        loaders: [ "imports?this=>window", "exports?this.WOW" ]
      },
      {
        test: /\.coffee$/, loader: "coffee-loader"
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./.modernizrrc"),
      jquery: "jquery/src/jquery"
    },
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_TYPE === "dev"))
    }),

    // See http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
    new webpack.ProvidePlugin({
      "$": "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery" 
    })
  ],
};

module.exports = config;
