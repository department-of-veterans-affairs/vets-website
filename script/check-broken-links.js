/* eslint-disable no-param-reassign */
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');

const pagesOutsideOfContent = [
  '/employment/job-seekers/skills-translator',
  '/employment/job-seekers/create-resume',
  '/employment/employers'
];

function checkBrokenLinks() {
  return (files, metalsmith, done) => {
    const ignorePaths = [
      ...pagesOutsideOfContent
    ];

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      const {
        entryname,
        path
      } = file;

      const isApp = !!entryname;
      if (isApp) ignorePaths.push(path);
    }

    const ignoreGlobs = ignorePaths.map(path => `${path}(.*)`);
    const ignoreLinks = new RegExp(ignoreGlobs.join('|'));
    const brokenLinkChecker = createBrokenLinkChecker({
      allowRedirects: true,
      warn: false,
      allowRegex: ignoreLinks
    });

    brokenLinkChecker(files);
    done();
  };
}

module.exports = checkBrokenLinks;
