const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const generateWebpackDevConfig = require('../webpack.dev.config.js');

const vaMedalliaStylesFilename = 'va-medallia-styles';

function setBaseConfig(
  buildOptions,
  buildPath,
  buildtype,
  entryFiles,
  isOptimizedBuild,
  enableCSSSourcemaps,
) {
  return {
    mode: 'development',
    entry: entryFiles,
    output: {
      path: path.resolve(buildPath, 'generated'),
      publicPath: '/generated/',
      filename: '[name].entry.js',
      chunkFilename: '[name].entry.js',
    },
    module: {
      strictExportPresence: true,
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
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'cache-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: enableCSSSourcemaps,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // use cssnano to minimize css only on optimized builds
                plugins: isOptimizedBuild
                  ? () => [require('autoprefixer'), require('cssnano')]
                  : () => [require('autoprefixer')],
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
      // Documentation: https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(buildtype),
        __API__: JSON.stringify(buildOptions.api),
      }),

      // Documentation: https://webpack.js.org/plugins/stylelint-webpack-plugin/
      new StylelintPlugin({
        configFile: '.stylelintrc.json',
        exclude: ['node_modules', 'build', 'coverage', '.cache'],
        fix: true,
      }),

      // Documentation: https://webpack.js.org/plugins/mini-css-extract-plugin/
      new MiniCssExtractPlugin({
        moduleFilename: chunk => {
          const { name } = chunk;

          const isMedalliaStyleFile = name === vaMedalliaStylesFilename;
          if (isMedalliaStyleFile) return `[name].css`;

          return `[name].css`;
        },
      }),

      // Documentation: https://webpack.js.org/plugins/copy-webpack-plugin/
      new CopyPlugin({
        patterns: [
          {
            from: 'src/site/assets',
            to: buildPath,
          },
        ],
      }),

      // Documentation: https://webpack.js.org/plugins/ignore-plugin/
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // Documentation: https://www.npmjs.com/package/webpackbar
      new WebpackBar(),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };
}

module.exports.setBaseConfig = setBaseConfig;
