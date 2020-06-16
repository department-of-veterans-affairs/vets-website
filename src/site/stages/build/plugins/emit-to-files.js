/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');

const stringify = data => JSON.stringify(data, null, 2);

const emitToFiles = (buildOptions, directory, getData = stringify) =>
  buildOptions['generate-files']
    ? files => {
        fs.emptyDirSync(directory);

        Object.keys(files).forEach(filePath => {
          const p = path.join(directory, filePath);
          console.log(`Writing file to ${p}`);
          fs.outputFileSync(p, getData(files[filePath]));
        });
      }
    : () => {
        console.log('Skipping...');
      };

module.exports = emitToFiles;
