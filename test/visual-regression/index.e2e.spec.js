const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const resemble = require('node-resemble-js');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const {sitemapURLs: getRoutes} = require('../e2e/sitemap-helpers');
const screenshotDirectory = path.join(__dirname, '../../logs/visual-regression');

function saveScreenshotAsBaseline(browser, baselineFileName, callback){
    console.log(`Writing file ${baselineFileName}`);
    browser.saveScreenshot(baselineFileName, callback);
}

function calculateScreenshotDiff(browser, baselineFileName, callback){
    
    // Read the baseline image contents
    const readBaselineImage = new Promise((resolve, reject) =>
         fs.readFile(baselineFileName, (err, result) => err ? reject(err) : resolve(result)));

    // Take a screenshot of the browser page
    const logScreenshotData = false;
    const takeScreenshot = new Promise((resolve, reject) => browser.screenshot(logScreenshotData, resolve));

    Promise
    
        // Wait for both operations to complete
        .all([readBaselineImage, takeScreenshot])

        // Convert the results to base64 and run the comparison operation
        .then(([baselineImageBuffer, screenshotResult]) => {
            const baselineImageBase64 = new Buffer(baselineImageBuffer, 'base64');
            const screenshotBase64 = new Buffer(screenshotResult.value, 'base64');
            
            // Use Resemble to determine any differences between the results
            return new Promise((resolve, reject) => {
                resemble(baselineImageBase64)
                    .compareTo(screenshotBase64)
                    .onComplete(resolve);
            });
        })

        // Run assertions on the results
        .then(comparisonResult => {
            console.log(comparisonResult);
        })

        .then(callback)

        // Catch errors to allow the other routes to continue even if this fails
        .catch(err => console.error(err));
}

function enqueueRoute(browser, routeHandler, route) {
    const uri = route.replace(baseUrl, '');
    const baselineFileName = path.join(screenshotDirectory, `/baseline${uri}.png`);
    const wrappedRouteHandler = resolve => browser.url(route, () => routeHandler(browser, baselineFileName, resolve));

    return new Promise((resolve, reject) => wrappedRouteHandler(resolve));
}

function getApplication(routeHandler){
    return function beginApplication(browser) {

        return new Promise((resolve, reject) => getRoutes(resolve))

            .then(routes => routes.slice(0, 2))

            // Map the array of URI's into promises returned by the route handler
            .then(routes => routes.map(route => enqueueRoute(browser, routeHandler, route)))

            // Wait for all operations to complete.
            .then(pendingRouteResults => Promise.all(pendingRouteResults))

            // Close the window. We're out of here.
            .then(() => browser.closeWindow())

            .catch(error => console.log(error));
    }
}

function getRouteHandler(){
    const commands = {
        CREATE_BASELINE_IMAGES: 'baseline',
        CALCULATE_DIFFS: 'diff'
    };
    
    const {command} = commandLineArgs([
        { name: 'command', type: String },
        { name: 'config', type: String, alias: 'c' }
    ]);

    switch (command){
        case commands.CREATE_BASELINE_IMAGES:
            console.log('Generating baseline images...');
            return saveScreenshotAsBaseline;

        case commands.CALCULATE_DIFFS:
        default:
            console.log('Calculating image diffs with baseline...');
            return calculateScreenshotDiff;
    }
}

function setup(){
    const routeHandler = getRouteHandler();
    const beginApplication = getApplication(routeHandler);

    return createE2eTest(beginApplication);
}

module.exports = setup();