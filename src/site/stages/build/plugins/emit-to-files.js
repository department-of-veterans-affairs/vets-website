/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');

const emitToFiles = directory => files => {
  fs.emptyDirSync(directory);

  Object.keys(files).forEach(filePath => {
    const p = path.join(directory, filePath);
    console.log(`Writing file to ${p}`);
    fs.outputFileSync(p, files[filePath].contents.toString('utf-8'));
  });
};

module.exports = emitToFiles;
