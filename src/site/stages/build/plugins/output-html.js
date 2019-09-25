/* eslint-disable no-param-reassign */

const outputHtml = files => {
  for (const fileName of Object.keys(files)) {
    const file = files[fileName];
    if (file.parsedContent && file.modified) {
      file.contents = new Buffer(file.parsedContent.html());
    }
  }
};

module.exports = outputHtml;
