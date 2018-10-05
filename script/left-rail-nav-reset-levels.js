/* eslint-disable no-continue, no-param-reassign */

/**
 * Writes a human-readable JavaScript file containing build properties available globally under `window.settings`.
 * @param {object} options The build options as passed to the build script and processed through Metalsmith.
 */

const path = require('path');

function LeftRailNavResetLevels() {
  return (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
      const file = files[key];
      const splitPath = key.split('/');

      if (splitPath.length === 5) {
        const parentPath = `${path.dirname(key)}.md`;

        file.collection = files[parentPath].collection;
      }
    });

    done();
  };
}

module.exports = LeftRailNavResetLevels;
