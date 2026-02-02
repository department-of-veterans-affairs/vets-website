module.exports = {
  extends: './.eslintrc.js',
  rules: {
    'jsx-a11y/control-has-associated-label': 1,
    'jsx-a11y/click-events-have-key-events': 2,
    'jsx-a11y/anchor-is-valid': 2,
    'jsx-a11y/label-has-associated-control': 1,
    'jsx-a11y/no-static-element-interactions': 2,
    '@department-of-veterans-affairs/prefer-table-component': 1,
    '@department-of-veterans-affairs/prefer-button-component': 1,
    '@department-of-veterans-affairs/prefer-icon-component': 1,
    '@department-of-veterans-affairs/prefer-telephone-component': 2,
    '@department-of-veterans-affairs/telephone-contact-digits': 2,
  },
  overrides: [
    {
      files: ['**/*.unit.spec.*'],
      excludedFiles: ['**/*.unit.spec.jsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Program',
            message:
              'Only .jsx files are allowed for unit spec files. Rename this file to .unit.spec.jsx.',
          },
        ],
      },
    },
  ],
};
