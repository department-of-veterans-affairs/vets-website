const path = require('path');
const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const {sitemapURLs} = require('../e2e/sitemap-helpers');
const screenshotDirectory = path.join(__dirname, '../../logs/visual-regression');

// Define a function for saving a screenshot
function saveScreenshotAsBaseline(browser, route){
    const fileName = `${screenshotDirectory}/baseline/test.png`;

    console.log(fileName)

    return new Promise((resolve, reject) => browser.saveScreenshot(fileName, resolve));
}

// Define a function for calculating a diff
function calculateScreenshotDiff(browser, route){

}

function getApplication(handleRoute){
    return function beginApplication(browser) {

        const routesRequest = new Promise((resolve, reject) => sitemapURLs(resolve));

        return routesRequest

            // Call the handler function for every 
            .then(routes => routes.slice(0,2).map(route => {
                browser.url(route);
                return handleRoute(browser, route);
            }))

            .then(pendingOperations => Promise.all(pendingOperations))
            
            .then(() => browser.end());
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
            return saveScreenshotAsBaseline;

        case commands.CALCULATE_DIFFS:
        default:
            return calculateScreenshotDiff;
    }
}

const routeHandler = getRouteHandler();
const beginApplication = getApplication(routeHandler);

module.exports = createE2eTest(beginApplication);