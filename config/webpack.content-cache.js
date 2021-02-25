const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(root, 'src', 'platform', 'lambdas', 'content-cache.js'),
  output: {
    path: path.join(root, 'build', 'content-cache'),
    filename: 'index.js',
  },
  target: 'node',
  node: { __dirname: true },
  plugins: [
    new webpack.IgnorePlugin(/process-cms-exports$/),
    new webpack.DefinePlugin({ 'process.env.CONTENT_CACHE_FUNCTION': true }),
  ],
};
