/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const transformedSchemasDir = path.join(__dirname, '../transformed');
const paragraphSchemas = fs
  .readdirSync(transformedSchemasDir)
  .filter(fileName => fileName.startsWith('paragraph'))
  .map(fileName => ({ $ref: `transformed/${path.basename(fileName, '.js')}` }));

module.exports = {
  $id: 'Paragraph',
  anyOf: paragraphSchemas,
};
