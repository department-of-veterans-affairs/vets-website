module.exports = {
  plugins: ['va'],
  rules: {
    'va/proptypes-camel-cased': 'error',
    'va/enzyme-unmount': 'error',
    'va/use-resolved-path': [
      'error',
      {
        aliases: ['applications', 'platform', 'site'],
      },
    ],
    'va/resolved-path-on-required': [
      'warn',
      {
        aliases: ['applications', 'platform', 'site'],
      },
    ],
    'va/axe-check-required': 'warn',
    'va/correct-apostrophe': 'warn',
    'va/cypress-viewport-deprecated': 'warn',
    'va/prefer-web-component-library': 'warn',
  },
};