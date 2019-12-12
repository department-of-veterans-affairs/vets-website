/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

module.exports = {
  $id: 'Paragraph',
  // Adding the catch-all object schema is a temporary fix
  // until we have schemas & transformers for all
  // paragraph entities
  anyOf: getAllSchemasOfType('paragraph').concat([{ type: 'object' }]),
};
