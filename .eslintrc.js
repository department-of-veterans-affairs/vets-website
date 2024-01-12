const babbleConfig = require('./babel.config.json');

const moduleResolverAlias =
  babbleConfig.plugins.find(plug => plug[0] === 'module-resolver')[1].alias ||
  {};
const aliasMap = Object.keys(moduleResolverAlias).map(alias => [
  alias,
  moduleResolverAlias[alias],
]);

module.exports = {
  // All rules should be disabled or they should produce errors. No warnings.
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: ['plugin:@department-of-veterans-affairs/recommended'],
  globals: {
    __BUILDTYPE__: true,
    __API__: true,
    __MEGAMENU_CONFIG__: true,
    __REGISTRY__: true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
      alias: {
        map: aliasMap,
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
      },
      'babel-module': {},
    },
  },
  rules: {
    /* || Eslint main rules || */
    camelcase: [2, { properties: 'always' }], // Override airbnb style.
    '@department-of-veterans-affairs/no-cross-app-imports': [
      'warn', // Warn for now, but after cleanup of imports, change to error
      {
        // Aliases copied from babel.config.json
        '~': './src',
        '@@vap-svc': './src/platform/user/profile/vap-svc',
        '@@profile': './src/applications/personalization/profile',
      },
    ],
    'deprecate/import': [
      'warn',
      {
        name: '@department-of-veterans-affairs/component-library/TextInput',
        use: '<va-text-input>',
      },
      {
        name:
          '@department-of-veterans-affairs/component-library/ExpandingGroup',
        use: 'a custom solution',
      },
      {
        name: '@department-of-veterans-affairs/component-library/Modal',
        use: '<va-modal>',
      },
      {
        name: '@department-of-veterans-affairs/component-library/FileInput',
        use: '<va-file-input>',
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
    'jsx-a11y/aria-role': [
      2,
      {
        allowedInvalidRoles: ['text'],
        ignoreNonDOM: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*'],
      rules: {
        'cypress/unsafe-to-chain-command': 'warn',
      },
    },
    {
      files: [
        '**/*.spec.jsx',
        '**/*.spec.js',
        'src/platform/testing/**/*.js',
        'src/platform/testing/**/*.jsx',
      ],
      rules: {
        'cypress/unsafe-to-chain-command': 'warn',
        'no-restricted-imports': ['error', 'raven'],
        'no-unused-expressions': 0,
        'react/no-find-dom-node': 0,
        '@department-of-veterans-affairs/axe-check-required': 0,
        '@department-of-veterans-affairs/cypress-viewport-deprecated': 0,
      },
    },
    {
      files: ['**/*.cypress.spec.js'],
      rules: {
        'cypress/unsafe-to-chain-command': 'warn',
        '@department-of-veterans-affairs/axe-check-required': 1,
        '@department-of-veterans-affairs/cypress-viewport-deprecated': 1,
      },
    },
  ],
};
