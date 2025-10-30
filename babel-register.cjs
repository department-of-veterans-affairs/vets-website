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
