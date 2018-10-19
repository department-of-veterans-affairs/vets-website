/* eslint-disable no-param-reassign */
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');
const cheerio = require('cheerio');

const pagesOutsideOfContent = [
  // These pages live outside of the content directory but are local links, so
  // they should be explicitly skipped.
  '/employment/job-seekers/skills-translator',
  '/employment/job-seekers/create-resume',
  '/employment/employers',

  // At this time, we still have link-references to this page, which no longer exists.
  // We should updated all reference instead to /education/apply/, but it's probably not
  // worth it during the brand-consolidation effort where pages are already moving.
  // This is a valid broken link though, so it should be addressed or removed soon.
  '/education/apply-for-education-benefits',
];

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
    const ignorePaths = [...pagesOutsideOfContent];

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

    brokenLinkChecker(files);
    removeLazySrcAttribute(files);
    done();
  };
}

module.exports = checkBrokenLinks;
