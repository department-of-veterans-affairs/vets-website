/* eslint-disable no-param-reassign */
const ENVIRONMENTS = require('../../../constants/environments');
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');
const cheerio = require('cheerio');

const lazyImageFiles = [];

function addLazySrcAttribute(file, fileName) {
  // if we have lazy images, they don't have a src attr,
  // so we need to add one for the blc
  if (file.contents.includes('data-src=')) {
    lazyImageFiles.push(fileName);
    const doc = cheerio.load(file.contents);
    doc('img[data-src]').each((i, el) => {
      doc(el).attr('src', doc(el).attr('data-src'));
    });
    file.contents = doc.html();
  }
}

function removeLazySrcAttribute(files) {
  // Go back and remove the src attr we added
  lazyImageFiles.forEach(fileName => {
    const file = files[fileName];
    const doc = cheerio.load(file.contents);
    doc('img[data-src]').each((i, el) => {
      doc(el).attr('src', null);
    });
    file.contents = doc.html();
  });
}

function checkBrokenLinks(buildOptions) {
  return (files, metalsmith, done) => {
    const ignorePaths = [];

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      const { entryname, path } = file;

      const isApp = !!entryname;
      if (isApp) ignorePaths.push(path);
      addLazySrcAttribute(file, fileName);
    }

    const ignoreGlobs = ignorePaths.map(path => `${path}(.*)`);
    ignoreGlobs.push('\\.asp');
    const ignoreLinks = new RegExp(ignoreGlobs.join('|'));
    const brokenLinkChecker = createBrokenLinkChecker({
      allowRedirects: true,
      warn: buildOptions.buildtype !== ENVIRONMENTS.VAGOVPROD,
      allowRegex: ignoreLinks,
    });

    brokenLinkChecker(files);
    removeLazySrcAttribute(files);
    done();
  };
}

module.exports = checkBrokenLinks;
