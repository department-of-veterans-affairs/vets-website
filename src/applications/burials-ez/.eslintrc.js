/* 
require-jsdoc is deprecated in ESLint v8 and will be removed in v9
but we are keeping it for now to enforce JSDoc comments in this project.

When ESLINT on vets-website is updated, consider using:
https://eslint.org/docs/latest/rules/require-jsdoc
*/

module.exports = {
  rules: {
    'prefer-const': 'error', // https://eslint.org/docs/latest/rules/prefer-const
    'require-jsdoc': 'error', // https://eslint.org/docs/latest/rules/require-jsdoc
    'valid-jsdoc': 'error', // https://eslint.org/docs/latest/rules/valid-jsdoc
    'no-unused-vars': 'error', // https://eslint.org/docs/latest/rules/no-unused-vars
  },
};
