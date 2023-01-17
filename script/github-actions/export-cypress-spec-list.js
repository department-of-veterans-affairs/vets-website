const glob = require('glob');
/* eslint-disable no-console */

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
  console.log(files);
});
