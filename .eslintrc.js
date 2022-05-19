module.exports = {
  // All rules should be disabled or they should produce errors. No warnings.
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['va'],
  extends: ['@department-of-veterans-affairs/eslint-config-vagov'],
  globals: {
    __BUILDTYPE__: true,
    __API__: true,
    __MEGAMENU_CONFIG__: true,
    __REGISTRY__: true,
  },
  rules: {
    /* || Eslint main rules || */
    camelcase: [2, { properties: 'always' }], // Override airbnb style.
    'deprecate/import': [
      'warn',
      {
        name:
          '@department-of-veterans-affairs/component-library/CollapsiblePanel',
        use: '<va-accordion>',
      },
      {
        name: '@department-of-veterans-affairs/component-library/AlertBox',
        use: '<va-alert>',
      },
      {
        name:
          '@department-of-veterans-affairs/component-library/LoadingIndicator',
        use: '<va-loading-indicator>',
      },
      {
        name:
          '@department-of-veterans-affairs/component-library/AdditionalInfo',
        use: '<va-additional-info>',
      },
      {
        name: '@department-of-veterans-affairs/component-library/ProgressBar',
        use: '<va-progress-bar>',
      },
    ],
    'jsx-a11y/control-has-associated-label': 1, // 2
    'jsx-a11y/click-events-have-key-events': 1, // 24
    'jsx-a11y/anchor-is-valid': 1, // 51
    'jsx-a11y/label-has-associated-control': [
      1,
      {
        controlComponents: ['select'],
      },
    ], // 40
    'jsx-a11y/no-static-element-interactions': 1, // 20

    /* || va custom plugin || */
    'va/proptypes-camel-cased': 2,
    'va/enzyme-unmount': 2,
    'va/use-resolved-path': [
      2,
      {
        aliases: ['applications', 'platform', 'site', '@@vap-svc', '@@profile'],
      },
    ],
    'va/correct-apostrophe': 1,
    'va/prefer-web-component-library': 1,
  },
  overrides: [
    {
      files: [
        '**/*.spec.jsx',
        '**/*.spec.js',
        'src/platform/testing/**/*.js',
        'src/platform/testing/**/*.jsx',
      ],
      rules: {
        'no-restricted-imports': ['error', 'raven'],
        'no-unused-expressions': 0,
        'react/no-find-dom-node': 0,
      },
    },
    {
      files: ['**/*.cypress.spec.js'],
      rules: {
        'va/axe-check-required': 1,
        'va/cypress-viewport-deprecated': 1,
      },
    },
  ],
};
