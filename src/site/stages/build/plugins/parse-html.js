/* eslint-disable no-param-reassign */
const path = require('path');
const cheerio = require('cheerio');

const parseHtml = files => {
  for (const fileName of Object.keys(files)) {
    if (path.extname(fileName) === '.html') {
      files[fileName].parsedContent = cheerio.load(files[fileName].contents);
    }
  }
};

module.exports = parseHtml;
