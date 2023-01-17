const glob = require('glob');

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
const files = countCySpecs();
/* eslint-disable no-console */

console.log(files);
