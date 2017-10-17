const fs = require('fs');
const resemble = require('node-resemble-js');
const { getFileNames, createDirectoryIfNotExist } = require('./get-file-names');
const DIFF_THRESHOLD = 0.01;

// A wrapper around fs.readFile to return a promise
function readFile(fileName) {
    return new Promise((resolve, reject) => fs.readFile(fileName, (err, result) => err ? reject(err) : resolve(result)));
}

// A wrapper around Nightwatch's screenshot function to return a promise
// Note - Nightwatch's screenshot stores the screenshot only in memory as opposed to saveScreenshot
function takeScreenshot(browser) {
    const logScreenshotData = false;
    return new Promise((resolve, reject) => browser.screenshot(logScreenshotData, resolve));
}

// Compares the values for the baseline image with the screenshot of the browser's current page.
function executeComparison(baselineImageBuffer, screenshotResult) {

    // Convert each into base 64
    const baselineImage = new Buffer(baselineImageBuffer, 'base64');
    const screenshot = new Buffer(screenshotResult.value, 'base64');

    // Execute ResembleJS to compare the images
    return new Promise((resolve, reject) => {
        resemble(baselineImage)
            .compareTo(screenshot)
            .onComplete(resolve);
    });
}

// Writes the diff image file used in the event the baseline doesn't match the screenshot of the browser's current page.
function createDiffImage(diffFileName, comparisonResult) {
    const diffImageStream = comparisonResult.getDiffImage();
    const writer = fs.createWriteStream(diffFileName);

    // A wrapper around the stream to return a promise
    return new Promise((resolve, reject) => {
        diffImageStream
            .pack()
            .pipe(writer)
            .once('finish', resolve);
    });
}

// After executing the comparison operation, inspect the result object to create a diff image and run the test.
function computeComparisonResult(browser, route, diffFileName, comparisonResult) {
    const misMatchPercentage = parseFloat(comparisonResult.misMatchPercentage);
    const changesExceedThreshold = misMatchPercentage > DIFF_THRESHOLD;

    // Execution the test assertion
    let operation = Promise.resolve().then(() => browser.verify.ok(!misMatchPercentage, route));

    // When the images differ, chain additional operations to create the diff image file
    if (changesExceedThreshold) {
        operation = operation

            // Create the directory first to prevent errors
            .then(() => createDirectoryIfNotExist(diffFileName))

            // Then actually write the diff file
            .then(() => createDiffImage(diffFileName, comparisonResult));
    }

    return operation;
}

// The entry point for this module as a route handler
function calculateDiff(browser, route) {
    const [ baselineFileName, diffFileName ] = getFileNames(route);
    const operations = [
        readFile(baselineFileName),
        takeScreenshot(browser)
    ];

    // Wait for the baseline file to be read and the screenshot operation to complete
    return Promise.all(operations)

        // After reading both images into memory, run the operation used to compare their contents
        .then(results => executeComparison(...results))

        // Process the results from the comparison
        .then(comparisonResult => computeComparisonResult(browser, route, diffFileName, comparisonResult));
}

module.exports = calculateDiff;
