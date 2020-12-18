const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  entry: path.join(root, 'script', 'get-content.js'),
  output: { path: path.join(root, 'build', 'content-cache') },
  target: 'node',
  node: { __dirname: true },
};
