/* eslint-disable no-param-reassign, no-console */
const ENVIRONMENTS = require('../../../constants/environments');

function createEnvironmentFilter(options) {
  const environmentName = options.buildtype;

  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      if (
        environmentName !== ENVIRONMENTS.LOCALHOST &&
        file.status === 'draft'
      ) {
        delete files[fileName];
      }

      if (file[environmentName] === false) {
        console.log(`File excluded from current buildtype: ${fileName}`);
        delete files[fileName];
      }
    }
    done();
  };
}

module.exports = createEnvironmentFilter;
