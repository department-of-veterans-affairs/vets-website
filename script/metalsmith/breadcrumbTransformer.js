// const jsdom = require('jsdom');
const cheerio = require('cheerio');
const path = require('path');

module.exports = (files, metalsmith, done) => {
  Object.keys(files).forEach(file => {
    if (path.extname(file) !== '.html') return;

    const data = files[file];
    const $ = cheerio.load(data.contents.toString());

    $('#va-breadcrumbs').each(() => {
      $.root().appendChild(
        '<script type="text/javascript" src="/js/breadcrumbs/mobile-breadcrumb.js"></script>'
      );
    });

    data.contents = new Buffer($.html());
    files[file] = data; // eslint-disable-line no-param-reassign
  });
  done();
};
