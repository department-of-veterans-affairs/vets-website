const fs = require('fs');
const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const { createE2eTest } = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const { sitemapURLs: getRoutes } = require('../e2e/sitemap-helpers');
const createBaselineImage = require('./util/create-baseline-image');
const calculateDiff = require('./util/calculate-diff');

function createOperationChain(browser, routes, routeHandler) {
    return routes.reduce((chain, route) => {
        const changeUrl = () => new Promise((resolve, reject) => browser.url(route, resolve));
        const routeHandlerWrapped = () => routeHandler(browser, route);

        return chain.then(() => changeUrl().then(routeHandlerWrapped));
    }, Promise.resolve());
}

function getApplication(routeHandler) {
    return function beginApplication(browser) {
        browser.perform(done => {
            new Promise((resolve, reject) => getRoutes(resolve))
                .then(routes => routes.slice(0, 10))  // @todo remove this
                .then(routes => createOperationChain(browser, routes, routeHandler))
                .then(() => browser.closeWindow())
                .then(done)
        })
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
            return createBaselineImage;

        case commands.CALCULATE_DIFFS:
        default:
            console.log('Calculating image diffs with baseline...');
            return calculateDiff;
    }
}

function setup() {
    const routeHandler = getRouteHandler();
    const beginApplication = getApplication(routeHandler);

    return createE2eTest(beginApplication);
}

module.exports = setup();