const path = require('path');

const getAbsolutePath = relativePath =>
  path.join(__dirname, '../', relativePath);

module.exports.getAbsolutePath = getAbsolutePath;
