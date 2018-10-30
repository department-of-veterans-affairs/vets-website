/* eslint-disable no-continue */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function applyFragments(buildOptions) {
  const fragmentsRoot = path.join(__dirname, buildOptions.contentFragments);

  return (files, smith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (!file.fragments) continue;

      for (const fragmentName of Object.keys(file.fragments)) {
        const fragmentFileName = file.fragments[fragmentName];
        const fileLocation = path.join(
          fragmentsRoot,
          `${fragmentFileName}.yml`,
        );
        const fragmentFile = fs.readFileSync(fileLocation);

        file[fragmentName] = yaml.safeLoad(fragmentFile);
      }
    }

    done();
  };
}

module.exports = applyFragments;
