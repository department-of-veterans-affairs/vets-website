/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

function getAllSchemasOfType(type) {
  const transformedSchemasDir = path.join(__dirname, '../output');
  return fs
    .readdirSync(transformedSchemasDir)
    .filter(fileName => fileName.startsWith(`${type}-`))
    .map(fileName => ({
      $ref: `output/${path.basename(fileName, '.js')}`,
    }));
}

module.exports = { getAllSchemasOfType };
