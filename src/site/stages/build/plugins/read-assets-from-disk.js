const fs = require('fs');
const path = require('path');

function readAssetsFromDisk(buildOptions) {
  let webpackOutputDir = '';

  if (buildOptions.destination) {
    webpackOutputDir = path.join(buildOptions.destination, 'generated');
  } else {
    webpackOutputDir = path.join(
      __dirname,
      '../../../../../build/',
      buildOptions.buildtype,
      'generated',
    );
  }

  return files => {
    if (fs.existsSync(webpackOutputDir)) {
      fs.readdirSync(webpackOutputDir).forEach(
        // eslint-disable-next-line no-return-assign
        filename =>
          // eslint-disable-next-line no-param-reassign
          (files[`generated/${filename}`] = {
            path: `generated/{$filename}`,
            contents: fs.readFileSync(path.join(webpackOutputDir, filename)),
          }),
      );
    } else {
      // eslint-disable-next-line no-console
      console.log('No Webpack assets found');
    }
  };
}

module.exports = readAssetsFromDisk;
