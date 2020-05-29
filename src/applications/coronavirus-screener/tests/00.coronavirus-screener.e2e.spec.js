const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../manifest.json');
const registry = require('applications/registry.json');

module.exports = E2eHelpers.createE2eTest(browser => {
  browser
    .url(`${E2eHelpers.baseUrl}/covid19screen`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  const incompleteClass = 'covid-screener-results-incomplete';

  browser.expect.element(`div.${incompleteClass}`).to.be.visible;

  browser.end();
});

// check if app is enabled in prod
const appInProd = registry.find(
  entry => entry.entryName === manifest.entryName,
);

// check if build type is production
// consistent problem:  `__BUILDTYPE__ is not defined`
// const buildIsProd = __BUILDTYPE__ !== 'production';

// only run if both are true
// const enable = appInProd && buildIsProd;
const enable = appInProd; // needed due to __BUILDTYPE__ error

module.exports['@disabled'] = !enable;

/*
to run locally:

NODE_ENV=production yarn build --buildtype vagovprod
yarn watch

yarn test:e2e src/applications/coronavirus-screener/tests/00.coronavirus-screener.e2e.spec.js

*/
