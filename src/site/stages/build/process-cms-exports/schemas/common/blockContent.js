/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

const paragraphSchemas = getAllSchemasOfType('block_content');
module.exports = {
  $id: 'BlockContent',
  anyOf: paragraphSchemas,
};
