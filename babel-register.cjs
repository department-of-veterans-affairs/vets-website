const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

try {
  require.resolve('@babel/preset-typescript');
  presets.push(['@babel/preset-typescript', { allowDeclareFields: true }]);
} catch (e) {
  // TODO: TS preset is optional in CI; skip if not installed
}

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignore: [/node_modules/],
  presets,
  cache: false,
});
