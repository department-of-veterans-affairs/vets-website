const path = require('path');

function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName])
    .filter(file => !file.private);
}

module.exports = getHtmlFileList;
