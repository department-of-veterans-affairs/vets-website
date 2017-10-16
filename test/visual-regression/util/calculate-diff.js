const fs = require('fs');
const resemble = require('node-resemble-js');
const { getFileNames, createDirectoryIfNotExist } = require('./get-file-names');

function readFile(fileName) {
    return new Promise((resolve, reject) => fs.readFile(fileName, (err, result) => err ? reject(err) : resolve(result)));
}

function takeScreenshot(browser) {
    const logScreenshotData = false;
    return new Promise((resolve, reject) => browser.screenshot(logScreenshotData, resolve));
}

function executeComparison([ baselineImageBuffer, screenshotResult ]) {
    const baselineImage = new Buffer(baselineImageBuffer, 'base64');
    const screenshot = new Buffer(screenshotResult.value, 'base64');

    return new Promise((resolve, reject) => {
        resemble(baselineImage)
            .compareTo(screenshot)
            .onComplete(resolve);
    });
}

function createDiffImage(diffFileName, comparisonResult) {
    const diffImageStream = comparisonResult.getDiffImage();
    const writer = fs.createWriteStream(diffFileName);

    return new Promise((resolve, reject) => {
        diffImageStream
            .pack()
            .pipe(writer)
            .once('finish', resolve);
    });
}

function computeComparisonResult(diffFileName, comparisonResult) {
    const misMatchPercentage = parseFloat(comparisonResult.misMatchPercentage);

    // @todo add assertions
    if (misMatchPercentage <= 0.01) {
        return;
    }

    return createDirectoryIfNotExist(diffFileName)

        .then(() => createDiffImage(diffFileName, comparisonResult));
}

function calculateDiff(browser, route) {
    const [ baselineFileName, diffFileName ] = getFileNames(route);
    const operations = [
        readFile(baselineFileName),
        takeScreenshot(browser)
    ];

    return Promise.all(operations)

        .then(executeComparison)

        .then(comparisonResult => computeComparisonResult(diffFileName, comparisonResult));
}

module.exports = calculateDiff;