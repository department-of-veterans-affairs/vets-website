const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

const breadcrumb = fs.readFileSync(path.join(__dirname, '../../assets/js/breadcrumbs/mobile-breadcrumb.js'), 'utf8');

module.exports = (files, metalsmith, done) => {
  Object.keys(files).forEach(file => {
    if (path.extname(file) !== '.html') return;

    const data = files[file];
    const $ = cheerio.load(data.contents.toString());
    const minifiedCode = UglifyJS.minify(breadcrumb);

    $('#va-breadcrumbs').each(() => {
      $.root().append(
        `<script type="text/javascript">${minifiedCode.code}</script>`
      );
    });

    data.contents = new Buffer($.html());
    files[file] = data; // eslint-disable-line no-param-reassign
  });
  done();
};
