const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const {baseUrl, createE2eTest} = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');

const routes = require('./routes')

const commands = {
    CREATE_BASELINE_IMAGES: 'baseline',
    CALCULATE_DIFF: 'diff'
};

console.log(process.argv)

// Define a function for calculating a diff
function calculateImageDiff(baseline, changed){

}

// Define a function for saving a screenshot
function saveScreenshot(){

}

// Define a function for taking a screenshot
function takeScreenshot(){

}

function calculateDiffs(){
    console.log('Calculating image diffs...');
}

function createBaselineImages(client){

    console.log('Creating baseline images...');

    client
        .url(baseUrl)
        .waitForElementVisible('body', Timeouts.slow)
        .end()
}

// Define a function that steps through a list of URL's, then either saves the screenshot or computes the diff
const method = (function getMethod(){
    
    const {command} = commandLineArgs([
        { name: 'command', type: String },
        { name: 'config', type: String, alias: 'c' }
    ]);

    switch (command){
        case commands.CREATE_BASELINE_IMAGES:
            return createBaselineImages;
        case commands.CALCULATE_DIFF:
        default:
            return calculateDiffs;
    }
})();

module.exports = createE2eTest(method);