/* eslint-disable no-continue, no-param-reassign */

/**
 * Sets the LeftRailNav sixth level to inherits the parent collection.
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
