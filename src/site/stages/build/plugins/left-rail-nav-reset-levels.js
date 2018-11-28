/* eslint-disable no-continue, no-param-reassign */

/**
 * Sets the LeftRailNav sixth level to inherits the parent collection.
 */

const path = require('path');

function LeftRailNavResetLevels() {
  return (files, metalsmith, done) => {
    Object.keys(files).forEach(key => {
      const file = files[key];
      const parentPath = `${path.dirname(key)}.md`;
      // remove the fifth level reset due to Emily's design changes.

      // added this to have the previous path available on the LeftRailNav
      file.previous = files[parentPath];
    });

    done();
  };
}

module.exports = LeftRailNavResetLevels;
