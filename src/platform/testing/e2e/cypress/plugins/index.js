const fs = require('fs');
const path = require('path');

module.exports = (on /* config */) => {
  on('task', {
    getTestData(relativeFilePath) {
      // The expected file path is relative to the project root.
      // Convert it to an absolute file path now that we are in Node.js.
      const absoluteFilePath = path.join(
        __dirname,
        '../../../../../..',
        relativeFilePath,
      );

      return JSON.parse(fs.readFileSync(absoluteFilePath), 'utf8');
    },
  });
};
