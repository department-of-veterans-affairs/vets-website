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
  extends: [
    'plugin:@department-of-veterans-affairs/recommended',
    'plugin:you-dont-need-momentjs/recommended',
  ],
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
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'CallExpression[callee.object.name="require"][callee.property.name="ensure"]',
        message:
          'require.ensure is deprecated. Use dynamic import() instead. See https://webpack.js.org/guides/code-splitting/#dynamic-imports',
      },
      {
        selector:
          'CallExpression[callee.object.type="ImportExpression"][callee.property.name="then"] > :matches(ArrowFunctionExpression, FunctionExpression) > ObjectPattern.params',
        message:
          'Do not destructure the parameter in import().then(). Use `module =>` and access `module.default` instead. Example: import("./foo").then(module => { const { Bar } = module.default; })',
      },
    ],
    camelcase: [2, { properties: 'always' }], // Override airbnb style.
    'react/jsx-wrap-multilines': 'off', // Conflicts with Prettier
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
        name: '@department-of-veterans-affairs/component-library/Modal',
        use: '<va-modal>',
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
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'you-dont-need-momentjs/no-dynamic-import-moment': 'warn',
        'you-dont-need-momentjs/no-import-moment': 'warn',
        'you-dont-need-momentjs/no-moment-constructor': 'warn',
        'you-dont-need-momentjs/no-require-moment': 'warn',
        'you-dont-need-momentjs/seconds': 'warn',
        'you-dont-need-momentjs/hours': 'warn',
        'you-dont-need-momentjs/date': 'warn',
        'you-dont-need-momentjs/day': 'warn',
        'you-dont-need-momentjs/day-of-year': 'warn',
        'you-dont-need-momentjs/week': 'warn',
        'you-dont-need-momentjs/iso-weeks-in-year': 'warn',
        'you-dont-need-momentjs/max': 'warn',
        'you-dont-need-momentjs/min': 'warn',
        'you-dont-need-momentjs/add': 'warn',
        'you-dont-need-momentjs/subtract': 'warn',
        'you-dont-need-momentjs/start-of': 'warn',
        'you-dont-need-momentjs/end-of': 'warn',
        'you-dont-need-momentjs/format': 'warn',
        'you-dont-need-momentjs/from-now': 'warn',
        'you-dont-need-momentjs/to': 'warn',
        'you-dont-need-momentjs/diff': 'warn',
        'you-dont-need-momentjs/days-in-month': 'warn',
        'you-dont-need-momentjs/is-before': 'warn',
        'you-dont-need-momentjs/is-same': 'warn',
        'you-dont-need-momentjs/is-after': 'warn',
        'you-dont-need-momentjs/is-between': 'warn',
        'you-dont-need-momentjs/is-leap-year': 'warn',
        'you-dont-need-momentjs/is-date': 'warn',
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
