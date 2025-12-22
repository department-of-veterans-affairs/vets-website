/*
The VA is using an old version of ESLint, which is why we are sticking with .eslintrc.js files.
Once they upgrade, we can consider moving to other formats:
https://eslint.org/docs/latest/use/configure/configuration-files

require-jsdoc is deprecated in ESLint v8 and will be removed in v9
but we are keeping it for now to enforce JSDoc comments in this project.

When ESLINT on vets-website is updated, consider using:
https://eslint.org/docs/latest/rules/require-jsdoc
*/

module.exports = {
  rules: {
    'prefer-const': 'warn', // https://eslint.org/docs/latest/rules/prefer-const
    'require-jsdoc': 'warn', // https://eslint.org/docs/latest/rules/require-jsdoc
    'valid-jsdoc': 'warn', // https://eslint.org/docs/latest/rules/valid-jsdoc
    'no-unused-vars': 'warn', // https://eslint.org/docs/latest/rules/no-unused-vars
  },
  overrides: [
    {
      files: ['**/tests/**', '**/*.spec.js'],
      rules: {
        'require-jsdoc': 'off',
        'valid-jsdoc': 'off',
      },
    },
  ],
};
