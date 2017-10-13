const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const routes = require('./routes');

// Define a function for saving a screenshot
function saveScreenshot(route, screenshot){

}

// Define a function for calculating a diff
function calculateScreenshotDiff(route, screenshot){

}

function createBeginApplication(handleScreenshot){
    return function beginApplication(browser) {

        console.log('here we are')

        // step through routes map
        // take the screenshot
        // pass it to the handleScreenshot argument

        browser
            .pause(15000)
            .url(baseUrl)
            .pause(15000)
            .end()
    }
}

function getScreenshotHandler(){
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
            return saveScreenshot;

        case commands.CALCULATE_DIFFS:
        default:
            return calculateScreenshotDiff;
    }
}

const screenshotHandler = getScreenshotHandler();
const beginApplication = createBeginApplication(screenshotHandler);

module.exports = createE2eTest(beginApplication);