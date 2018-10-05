/* eslint-disable no-param-reassign */
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');

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

function checkBrokenLinks() {
  return (files, metalsmith, done) => {
    const ignorePaths = [...pagesOutsideOfContent];

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      const { entryname, path } = file;

      const isApp = !!entryname;
      if (isApp) ignorePaths.push(path);
    }

    const ignoreGlobs = ignorePaths.map(path => `${path}(.*)`);
    const ignoreLinks = new RegExp(ignoreGlobs.join('|'));
    const brokenLinkChecker = createBrokenLinkChecker({
      allowRedirects: true,
      warn: false,
      allowRegex: ignoreLinks,
    });

    brokenLinkChecker(files);
    done();
  };
}

module.exports = checkBrokenLinks;
