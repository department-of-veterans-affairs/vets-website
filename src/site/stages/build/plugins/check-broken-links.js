/* eslint-disable no-param-reassign */
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');
const cheerio = require('cheerio');

const DRUPALS = require('../../../constants/drupals');

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
    const ignoreLinks = new RegExp(ignoreGlobs.join('|'));
    const brokenLinkChecker = createBrokenLinkChecker({
      allowRedirects: true,
      warn: false,
      allowRegex: ignoreLinks,
    });

    // Filter out drupal pages
    // Once Drupal is live, we should be able to delete all of this and just
    // validate all of files.
    let filteredFiles = { ...files };
    if (DRUPALS.ENABLED_ENVIRONMENTS.has(buildOptions.buildtype)) {
      if (DRUPALS.PREFIXED_ENVIRONMENTS.has(buildOptions.buildtype)) {
        // On Drupal-prefixed builds, ignore all pages beginning with /drupal.
        filteredFiles = Object.keys(files)
          .filter(
            fileName =>
              !files[fileName].path || !files[fileName].path.includes('drupal'),
          )
          .reduce((acc, fileName) => {
            acc[fileName] = files[fileName];
            return acc;
          }, {});
      } else {
        for (const fileName of Object.keys(filteredFiles)) {
          // On Drupal-enabled non-prefixed builds, either filter out the Drupal
          // page; or, if this Drupal page overwrote a Vagov-content page, then
          // validate the overwritten page.
          const file = filteredFiles[fileName];
          if (file.isDrupalPage) {
            if (file.overwrittenVagovContentPage) {
              filteredFiles[fileName] = file.overwrittenVagovContentPage;
            } else {
              delete filteredFiles[fileName];
            }
          }
        }
      }
    }

    brokenLinkChecker(filteredFiles);
    removeLazySrcAttribute(files);
    done();
  };
}

module.exports = checkBrokenLinks;
