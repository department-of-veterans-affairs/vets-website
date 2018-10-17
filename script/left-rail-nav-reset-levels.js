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
      const parentPath = `${path.dirname(key)}.md`;

      if (splitPath.length === 5) {
        file.collection = files[parentPath].collection;
      }

      // added this to have the previous path available on the LeftRailNav
      file.previous = files[parentPath];
    });

    done();
  };
}

module.exports = LeftRailNavResetLevels;
