const { getFileNames } = require('./get-file-names');

function createBaselineImage(browser, route) {
    const [ baselineFileName ] = getFileNames(route);
    return new Promise((resolve, reject) => browser.saveScreenshot(baselineFileName, resolve));
}

module.exports = createBaselineImage;