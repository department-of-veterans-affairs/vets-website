module.exports = {
  rules: {
    'proptypes-camel-cased': require('./rules/proptypes-camel-cased'),
    'enzyme-unmount': require('./rules/enzyme-unmount.js'),
    'use-resolved-path': require('./rules/use-resolved-path.js'),
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
  },
};
