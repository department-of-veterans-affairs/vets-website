/* eslint-disable no-param-reassign */
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

function checkBrokenLinks() {
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
    const ignoreLinks = new RegExp(ignoreGlobs.join('|'));
    const brokenLinkChecker = createBrokenLinkChecker({
      allowRedirects: true,
      warn: false,
      allowRegex: ignoreLinks,
    });

    // Filter out drupal pages
    const filteredFiles = Object.keys(files)
      .filter(
        fileName =>
          !files[fileName].path || !files[fileName].path.includes('drupal'),
      )
      .reduce((acc, fileName) => {
        acc[fileName] = files[fileName];
        return acc;
      }, {});

    brokenLinkChecker(filteredFiles);
    removeLazySrcAttribute(files);
    done();
  };
}

module.exports = checkBrokenLinks;
