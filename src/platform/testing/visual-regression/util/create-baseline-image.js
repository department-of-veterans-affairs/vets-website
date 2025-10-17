const { getFileNames, createDirectoryIfNotExist } = require('./get-file-names');

// The entry point for this module as a route handler.
// Uses Nightwatch's native screenshot function to take a screenshot.
async function createBaselineImage(browser, route) {
  const [baselineFileName] = getFileNames(route);
  await createDirectoryIfNotExist(baselineFileName);
  await browser.screenshot({
    path: baselineFileName,
    fullPage: true,
    type: 'png',
  });
}

module.exports = createBaselineImage;
