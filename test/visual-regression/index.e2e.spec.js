const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const resemble = require('node-resemble-js');
const Timeouts = require('../e2e/timeouts');
const { baseUrl, createE2eTest } = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const { sitemapURLs: getRoutes } = require('../e2e/sitemap-helpers');
const screenshotDirectory = path.join(__dirname, '../../logs/visual-regression');

function getFileNames(route){
    const uri = route.replace(baseUrl, '');
    const baseline = path.join(screenshotDirectory, `/baseline${uri}.png`);
    const diff = path.join(screenshotDirectory, `/diffs${uri}.png`);

    return [baseline, diff];
}

function saveScreenshotAsBaseline(browser, route) {
    const [baselineFileName] = getFileNames(route);
    return new Promise((resolve, reject) => browser.saveScreenshot(baselineFileName, resolve));
}

function calculateScreenshotDiff(browser, route) {

    const [baselineFileName, diffFileName] = getFileNames(route);

    // Read the baseline image contents
    const readBaselineImage = new Promise((resolve, reject) =>
        fs.readFile(baselineFileName, (err, result) => err ? reject(err) : resolve(result)));

    // Take a screenshot of the browser page
    const logScreenshotData = false;
    const takeScreenshot = new Promise((resolve, reject) => browser.screenshot(logScreenshotData, resolve));

    return Promise

        // Wait for both operations to complete
        .all([ readBaselineImage, takeScreenshot ])

        // Convert the results to base64 and run the comparison operation
        .then(([ baselineImageBuffer, screenshotResult ]) => {
            const baselineImage = new Buffer(baselineImageBuffer, 'base64');
            const screenshot = new Buffer(screenshotResult.value, 'base64');

            // Use Resemble to determine any differences between the results
            return new Promise((resolve, reject) => {
                resemble(baselineImage)
                    .compareTo(screenshot)
                    .onComplete(resolve);
            });
        })

        // Run assertions on the results
        .then(comparisonResult => {
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
        })

        .catch(err => console.error(err));
}

function getApplication(routeHandler) {
    return function beginApplication(browser) {

        return new Promise((resolve, reject) => getRoutes(resolve))

            // Map the array of URI's into promises returned by the route handler
            .then(routes => routes.map(route => 
                new Promise((resolve, reject) => browser.url(route, resolve))
                    .then(() => routeHandler(browser, route))
            ))

            // Wait for all operations to complete
            .then(pendingRouteResults => Promise.all(pendingRouteResults))

            .then(() => browser.closeWindow())

            .catch(error => console.log(error));
    }
}

function getRouteHandler() {
    const commands = {
        CREATE_BASELINE_IMAGES: 'baseline',
        CALCULATE_DIFFS: 'diff'
    };

    const { command } = commandLineArgs([
        { name: 'command', type: String },
        { name: 'config', type: String, alias: 'c' }
    ]);

    switch (command) {
        case commands.CREATE_BASELINE_IMAGES:
            console.log('Generating baseline images...');
            return saveScreenshotAsBaseline;

        case commands.CALCULATE_DIFFS:
        default:
            console.log('Calculating image diffs with baseline...');
            return calculateScreenshotDiff;
    }
}

function setup() {
    const routeHandler = getRouteHandler();
    const beginApplication = getApplication(routeHandler);

    return createE2eTest(beginApplication);
}

module.exports = setup();