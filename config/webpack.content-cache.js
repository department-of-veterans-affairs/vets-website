const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(root, 'script', 'get-content.js'),
  output: { path: path.join(root, 'build', 'content-cache') },
  target: 'node',
  node: { __dirname: true },
  plugins: [
    new webpack.IgnorePlugin(/process-cms-exports$/),
    new webpack.DefinePlugin({ __CONTENT_CACHE_FUNCTION__: true }),
  ],
};
