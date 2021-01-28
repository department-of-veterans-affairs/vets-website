module.exports = {
  rules: {
    'proptypes-camel-cased': require('./rules/proptypes-camel-cased'),
    'enzyme-unmount': require('./rules/enzyme-unmount.js'),
    'use-resolved-path': require('./rules/use-resolved-path.js'),
    'resolved-path-on-required': require('./rules/resolved-path-on-required.js'),
    'axe-check-required': require('./rules/axe-e2e-tests.js'),
  },
  rulesConfig: {
    'proptypes-camel-cased': 2,
    'enzyme-unmount': 2,
    'use-resolved-path': [
      2,
      {
        aliases: ['applications', 'platform', 'site'],
      },
    ],
    'resolved-path-on-required': [
      1,
      {
        aliases: ['applications', 'platform', 'site'],
      },
    ],
    'axe-check-required': 1,
  },
};
