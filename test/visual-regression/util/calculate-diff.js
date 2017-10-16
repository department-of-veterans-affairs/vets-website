const fs = require('fs');
const resemble = require('node-resemble-js');
const getFileNames = require('./get-file-names');

function readFile(fileName){
    return new Promise((resolve, reject) => fs.readFile(fileName, (err, result) => err ? reject(err) : resolve(result)));
}

function takeScreenshot(browser){
    const logScreenshotData = false;
    return new Promise((resolve, reject) => browser.screenshot(logScreenshotData, resolve));
}

function executeComparison([ baselineImageBuffer, screenshotResult ]){
    const baselineImage = new Buffer(baselineImageBuffer, 'base64');
    const screenshot = new Buffer(screenshotResult.value, 'base64');

    // Use Resemble to determine any differences between the results
    return new Promise((resolve, reject) => {
        resemble(baselineImage)
            .compareTo(screenshot)
            .onComplete(resolve);
    });
}

function computeComparisonResult(diffFileName, comparisonResult){
    const misMatchPercentage = parseFloat(comparisonResult.misMatchPercentage);
    
    if (misMatchPercentage <= 0.01) {
        return;
    }

    const diffImageStream = comparisonResult.getDiffImage();
    const writer = fs.createWriteStream(diffFileName);

    return new Promise((resolve, reject) => {
        diffImageStream.pack().pipe(writer);
        diffImageStream.on('finish', resolve);
    });
}

function calculateDiff(browser, route) {
    const [baselineFileName, diffFileName] = getFileNames(route);
    const operations = [
        readFile(baselineFileName),
        takeScreenshot(browser)
    ];

    return Promise.all(operations)

        .then(executeComparison)

        .then(comparisonResult => computeComparisonResult(diffFileName, comparisonResult));
}

module.exports = calculateDiff;