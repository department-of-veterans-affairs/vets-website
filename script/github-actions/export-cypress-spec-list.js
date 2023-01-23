const glob = require('glob');
const core = require('@actions/core');

const countCySpecs = () => {
  return new Promise((resolve, reject) => {
    glob('**/*.cypress.spec.js?(x)', (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
};
countCySpecs().then(files => {
  core.exportVariable('ALL_CYPRESS_SPECS', files);
});
