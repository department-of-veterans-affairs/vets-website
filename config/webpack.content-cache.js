const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(root, 'src', 'platform', 'lambdas', 'content-cache.js'),
  output: {
    path: path.join(root, 'build', 'content-cache'),
    filename: 'exports.js',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  node: { __dirname: true },
  plugins: [
    new webpack.IgnorePlugin(/process-cms-exports$/),
    new webpack.DefinePlugin({ 'process.env.CONTENT_CACHE_FUNCTION': true }),
  ],
  optimization: {
    // Disabling minimization to avoid errors from parsing optional chaining,
    // which our current versions of Terser + Webpack don't support.
    minimize: false,
  },
  externals: {
    'aws-sdk/clients/s3': 'commonjs2 aws-sdk/clients/s3',
  },
};
