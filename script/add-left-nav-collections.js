/* eslint-disable no-continue, no-param-reassign */

/**
 * Writes a human-readable JavaScript file containing build properties available globally under `window.settings`.
 * @param {object} options The build options as passed to the build script and processed through Metalsmith.
 */
function addLeftNavCollections() {
  return (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
      const file = files[key];
      const splitPath = key.split('/');

      if (splitPath.length === 5) {
        splitPath.pop();

        const parentFile = `${splitPath.join('/')}.md`;

        Object.assign(file, {
          collection: files[parentFile].collection,
        });
      }
    });

    done();
  };
}

module.exports = addLeftNavCollections;
