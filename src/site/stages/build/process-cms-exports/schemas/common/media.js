/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

module.exports = {
  $id: 'Media',
  // Adding the catch-all object schema is a temporary fix
  // until we have schemas & transformers for all
  // media entities
  anyOf: getAllSchemasOfType('media').concat([{ type: ['object', 'null'] }]),
};
