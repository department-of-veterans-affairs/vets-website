/* eslint-disable no-param-reassign */
const createBrokenLinkChecker = require('metalsmith-broken-link-checker');

// const oldBlcAllowRegex =  [
//   '/education/gi-bill/post-9-11/ch-33-benefit',
//   '/employment/commitments',
//   '/employment/employers',
//   '/employment/job-seekers/create-resume',
//   '/employment/job-seekers/search-jobs',
//   '/employment/job-seekers/skills-translator',
//   '/gi-bill-comparison-tool/',
//   '/education/apply-for-education-benefits/application',
//   '/pension/application/527EZ',
//   '/burials-and-memorials/application/530',
//   '/health-care/apply/application',
//   '/health-care/apply-for-health-care-form-10-10ez',
//   '/veteran-id-card/apply',
//   '/veteran-id-card/how-to-get',
//   '/download-va-letters/letters',
//   '/education/apply-for-gi-bill-form-1990/',
//   '/education/survivor-dependent-benefits/apply-for-dependent-benefits-form-22-5490/',
//   '/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e/',
//   '/education/other-va-education-benefits/national-call-to-service-program/apply-for-benefits-under-ncs-form-1990n/',
//   '/education/change-gi-bill-benefits/request-change-form-22-1995/',
//   '/education/change-gi-bill-benefits/dependent-request-change-form-22-5495/',
// ]

function checkBrokenLinks() {
  const pagesWithoutRouting = {};

  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];

      const {
        entryname
      } = file;

      const isApp = !!entryname;
      if (!isApp) pagesWithoutRouting[fileName] = file;
    }

    const brokenLinkChecker = createBrokenLinkChecker({ allowRedirects: true, warn: false });
    brokenLinkChecker(pagesWithoutRouting, metalsmith, done);
  };
}

module.exports = checkBrokenLinks;
