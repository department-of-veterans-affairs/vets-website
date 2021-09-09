const { getAbsolutePath } = require('../helpers/get-absolute-path');

const vaMedalliaStylesFilename = 'va-medallia-styles';
const sharedModules = [
  getAbsolutePath('../../src/platform/polyfills'),
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  '@sentry/browser',
];

const setEntryFiles = {
  polyfills: getAbsolutePath(
    '../../src/platform/polyfills/preESModulesPolyfills.js',
  ),
  style: getAbsolutePath('../../src/platform/site-wide/sass/style.scss'),
  [vaMedalliaStylesFilename]: getAbsolutePath(
    '../../src/platform/site-wide/sass/va-medallia-style.scss',
  ),
  styleConsolidated: getAbsolutePath(
    '../../src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: sharedModules,
  // This is to solve the issue of the vendor file being cached
  'shared-modules': sharedModules,
  'web-components': getAbsolutePath(
    '../../src/platform/site-wide/wc-loader.js',
  ),
};

module.exports.setEntryFiles = setEntryFiles;
