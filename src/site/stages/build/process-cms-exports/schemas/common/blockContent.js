/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

module.exports = {
  $id: 'BlockContent',
  anyOf: getAllSchemasOfType('block_content'),
};
