// script/github-actions/babel-register.cjs (or wherever your register lives)
const fs = require('fs');
const path = require('path');
const Module = require('module');

// 1) Make absolute imports from src/ work as a safety net
const srcPath = path.resolve(__dirname, '../../src');
process.env.NODE_PATH = [srcPath, process.env.NODE_PATH]
  .filter(Boolean)
  .join(path.delimiter);
Module._initPaths();

// 2) Prefer the repo root babel.config.json (so module-resolver aliases apply)
const repoRoot = path.resolve(__dirname, '../../');
const babelConfigFile = path.join(repoRoot, 'babel.config.json');
const hasRootConfig = fs.existsSync(babelConfigFile);

// 3) Your existing preset stack as a fallback (used only if no root config)
const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];
try {
  require.resolve('@babel/preset-typescript');
  presets.push(['@babel/preset-typescript', { allowDeclareFields: true }]);
} catch (_) {
  // TS preset optional; skip if unavailable (e.g., CI)
}

// 4) Register Babel
require('@babel/register')(
  hasRootConfig
    ? {
        // Use the root config (includes your module-resolver aliases)
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        ignore: [/node_modules/],
        cache: false,
        rootMode: 'upward-optional',
        configFile: babelConfigFile,
      }
    : {
        // Fallback to inline presets if no root config is present
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        ignore: [/node_modules/],
        cache: false,
        rootMode: 'upward-optional',
        presets,
      },
);
