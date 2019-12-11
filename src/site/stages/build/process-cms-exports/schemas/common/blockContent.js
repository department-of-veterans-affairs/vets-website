/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

module.exports = {
  $id: 'BlockContent',
  // Adding the catch-all object schema is a temporary fix
  // until we have schemas & transformers for all
  // block_content entities
  anyOf: getAllSchemasOfType('block_content').concat([{ type: 'object' }]),
};
