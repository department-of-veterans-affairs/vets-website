/* eslint-disable no-param-reassign */

const replaceContentsWithDom = files => {
  for (const fileName of Object.keys(files)) {
    const file = files[fileName];
    if (file.dom && file.modified) {
      file.contents = new Buffer(file.dom.html());
    }
  }
};

module.exports = replaceContentsWithDom;
