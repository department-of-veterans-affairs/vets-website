const fs = require('fs');
const path = require('path');

function readAssetsFromDisk(buildOptions) {
  const webpackOutput = path.join(
    __dirname,
    '../../../../../build/',
    buildOptions.buildtype,
    'generated',
  );
  return files => {
    fs.readdirSync(webpackOutput).forEach(
      // eslint-disable-next-line no-return-assign
      filename =>
        // eslint-disable-next-line no-param-reassign
        (files[`generated/${filename}`] = {
          path: `generated/{$filename}`,
          contents: fs.readFileSync(path.join(webpackOutput, filename)),
        }),
    );
  };
}

module.exports = readAssetsFromDisk;
