const path = require('path');
const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const {sitemapURLs} = require('../e2e/sitemap-helpers');
const screenshotDirectory = path.join(__dirname, '../../logs/visual-regression');

// Define a function for saving a screenshot
function saveScreenshotAsBaseline(browser, baselineFileName, uri){
    console.log(`Writing file ${baselineFileName}`);
    return new Promise((resolve, reject) => browser.saveScreenshot(baselineFileName, resolve));
}

// Define a function for calculating a diff
function calculateScreenshotDiff(browser, baselineFileName, uri){

}

function mapRouteToRouteHandler(browser, route, routeHandler){
    const uri = route.replace(baseUrl, '');
    const baselineFileName = `${screenshotDirectory}/baseline${uri}.png`;
    const onRouteLoaded = () => routeHandler(browser, baselineFileName, uri);

    return browser.url(route, onRouteLoaded);
}

function getApplication(routeHandler){
    return function beginApplication(browser) {
        const routesRequest = new Promise((resolve, reject) => sitemapURLs(resolve));

        return routesRequest

            // Map the array of routes into an array of operation promises
            .then(routes => routes.map(route => mapRouteToRouteHandler(browser, route, routeHandler)))

            // Wait for all operations to complete
            .then(pendingRouteResults => Promise.all(pendingRouteResults))
            
            .then(() => browser.end())

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