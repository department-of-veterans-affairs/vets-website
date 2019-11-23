/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

const paragraphSchemas = getAllSchemasOfType('paragraph');
module.exports = {
  $id: 'Paragraph',
  anyOf: paragraphSchemas,
};
