const glob = require('glob');
const fs = require('fs');

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

const countUnitSpecs = () => {
  return new Promise((resolve, reject) => {
    glob('**/*.unit.spec.js?(x)', (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
};
countCySpecs().then(files => {
  fs.writeFileSync(`e2e_spec_list.json`, JSON.stringify(files));
});

countUnitSpecs().then(files => {
  fs.writeFileSync(`unit_test_spec_list.json`, JSON.stringify(files));
});
