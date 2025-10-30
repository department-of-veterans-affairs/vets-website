const path = require('path');
const Module = require('module');

const srcPath = path.join(__dirname, 'src');
process.env.NODE_PATH = [srcPath, process.env.NODE_PATH]
  .filter(Boolean)
  .join(path.delimiter);
Module._initPaths();

const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

try {
  require.resolve('@babel/preset-typescript');
  presets.push(['@babel/preset-typescript', { allowDeclareFields: true }]);
} catch (e) {
  // TS preset optional; skip if unavailable (e.g., CI)
}

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignore: [/node_modules/],
  presets,
  cache: false,
});
