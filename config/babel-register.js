// Custom Babel register configuration to handle TypeScript files
require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
  ignore: [/node_modules/],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
});
