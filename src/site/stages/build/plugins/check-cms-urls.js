/* eslint-disable no-console */
const ENVIRONMENTS = require('../../../constants/environments');

const ignoredPages = new Set(['drupal/test/index.html']);

function checkForCMSUrls(BUILD_OPTIONS) {
  return (files, metalsmith, done) => {
    const filesWithBadUrls = [];
    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      if (file.isDrupalPage && !ignoredPages.has(fileName)) {
        const contents = file.contents.toString();
        if (
          contents.includes('cms.va.gov') ||
          contents.includes('-vagovcms-3000') ||
          contents.includes('va.agile6.com')
        ) {
          filesWithBadUrls.push(fileName);
        }
      }
    }

    if (filesWithBadUrls.length) {
      console.log(
        'The following pages have an internal AWS, cms.va.gov, or va.agile6.com url referenced:',
      );
      console.log(filesWithBadUrls.join('\n'));

      if (BUILD_OPTIONS.buildtype === ENVIRONMENTS.VAGOVPROD) {
        throw new Error('Pages found that reference internal CMS urls');
      }
    }

    done();
  };
}

module.exports = checkForCMSUrls;
