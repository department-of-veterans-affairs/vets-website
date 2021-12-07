const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
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
    'correct-apostrophe': 1,
  },
};
