const path = require('path');
const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const {sitemapURLs: getRoutes} = require('../e2e/sitemap-helpers');

const screenshotDirectory = path.join(__dirname, '../../logs/visual-regression');

function getBaselineFileName(route){
    const uri = route.replace(baseUrl, '');

    return `${screenshotDirectory}/baseline${uri}.png`;
}

function saveScreenshotAsBaseline(browser, route, callback){
    const fileName = getBaselineFileName(route);
    
    browser.url(route, () => browser.saveScreenshot(fileName, callback));
}

function calculateScreenshotDiff(browser, route, callback){
    
    // Promise 1 - Read the baseline image contents
    // Promise 2 - Update the URL and take a screenshot
    // Once both promises have resolved, compare the images.
    // If possible, create and save a new image showing the diff.

}

function getApplication(routeHandler){
    return function beginApplication(browser) {

        return new Promise((resolve, reject) => getRoutes(resolve))

            .then(routes => routes.map(route => new Promise((resolve, reject) => routeHandler(browser, route, resolve))))

            .then(pendingRouteResults => Promise.all(pendingRouteResults))
            
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