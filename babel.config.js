// Babel is only used to transpile TypeScript for running Jest tests
module.exports = {
  // This is from the Jest docs; it may not be optimal
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
};
