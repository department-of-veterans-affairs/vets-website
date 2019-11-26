/* eslint-disable import/no-dynamic-require */
const { getAllSchemasOfType } = require('./helpers');

module.exports = {
  $id: 'Paragraph',
  anyOf: getAllSchemasOfType('paragraph'),
};
