/* eslint-disable no-console */
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
          contents.includes('va.agile6.com')
        ) {
          filesWithBadUrls.push(fileName);
        }
      }
    }

    if (filesWithBadUrls.length) {
      console.log(
        'The following pages have cms.va.gov or va.agile6.com referenced:',
      );
      console.log(filesWithBadUrls.join('\n'));

      if (!BUILD_OPTIONS.watch) {
        throw new Error('Pages found that reference internal CMS urls');
      }
    }

    done();
  };
}

module.exports = checkForCMSUrls;
