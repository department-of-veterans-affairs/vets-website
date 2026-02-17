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
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // FIXME: remove this after the node upgrade is complete
        warnOnUnsupportedTypeScriptVersion: false,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@department-of-veterans-affairs/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:you-dont-need-momentjs/recommended',
      ],
      rules: {
        // Allow TypeScript-specific syntax
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Disable conflicting rules from base config
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],

        // TypeScript handles these checks
        'import/no-unresolved': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],

        // Apply the stricter changed file rules
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
        '@department-of-veterans-affairs/remove-expanding-group': 1,
        'deprecate/import': [
          'error',
          {
            name: '@department-of-veterans-affairs/component-library/TextInput',
            use: '<va-text-input>',
          },
        ],
      },
    },
    {
      files: ['**/*.unit.spec.*'],
      excludedFiles: [
        '**/*.unit.spec.jsx',
        '**/*.unit.spec.ts',
        '**/*.unit.spec.tsx',
      ],
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
