module.exports = {
  rules: {
    'proptypes-camel-cased': require('./lib/rules/proptypes-camel-cased'),
    'enzyme-unmount': require('./lib/rules/enzyme-unmount'),
    'use-resolved-path': require('./lib/rules/use-resolved-path'),
    'resolved-path-on-required': require('./lib/rules/resolved-path-on-required'),
    'axe-check-required': require('./lib/rules/axe-e2e-tests'),
    'correct-apostrophe': require('./lib/rules/correct-apostrophe'),
    'cypress-viewport-deprecated': require('./lib/rules/cypress-viewport-deprecated'),
    'prefer-web-component-library': require('./lib/rules/prefer-web-component-library'),
  },
  configs: {
    recommended: require('./lib/config/recommended'),
  },
};
