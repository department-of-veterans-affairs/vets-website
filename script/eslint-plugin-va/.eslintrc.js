'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'eslint-plugin/require-meta-type': 'off',
    'eslint-plugin/require-meta-docs-url': 'off',
    'eslint-plugin/require-meta-schema': 'off',
  },
};
