const { sass } = require('@stencil/sass');
const { reactOutputTarget } = require('@stencil/react-output-target');

const config = {
  namespace: 'your-component-library',
  plugins: [sass()],
  testing: {
    setupFiles: ['./src/platform/testing/unit/jest.setup.js'],
    testEnvironment: './stencil-environment.js',
    testRegex: '.*\\.stencil\\.spec\\.jsx$',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '^platform/(.*)$': '<rootDir>/src/platform/$1',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@department-of-veterans-affairs)/)',
    ],
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: 'your-component-library',
      proxiesFile: './src/components.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'docs-json',
      file: 'docs.json',
    },
  ],
};

const devServer = {
  root: 'www',
  watchGlob: '**/**',
};

module.exports = {
  config,
  devServer,
};
