const fs = require('fs');
const commandLineArgs = require('command-line-args');
const Timeouts = require('../e2e/timeouts');
const { createE2eTest } = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');
const { sitemapURLs: getRoutes } = require('../e2e/sitemap-helpers');
const createBaselineImage = require('./util/create-baseline-image');
const calculateDiff = require('./util/calculate-diff');

function mapRoutesToRouteHandlers(browser, routes, routeHandler) {
    return routes.map(route => {
        const changeUrl = new Promise((resolve, reject) => browser.url(route, resolve));
        const routeHandlerWrapped = () => routeHandler(browser, route);

        return changeUrl.then(routeHandlerWrapped);
    });
}

function getApplication(routeHandler) {
    return function beginApplication(browser) {

        return new Promise((resolve, reject) => getRoutes(resolve))

            .then(routes => mapRoutesToRouteHandlers(browser, routes, routeHandler))

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