const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../manifest.json');
const registry = require('applications/registry.json');

// tests when all answers are the same, e.g. yes or no
function testEndStateForAnswer(browser, value) {
  const visibleResultClass =
    value === 'no'
      ? 'covid-screener-results-pass'
      : 'covid-screener-results-fail';
  const notPresentResultClass =
    value === 'no'
      ? 'covid-screener-results-fail'
      : 'covid-screener-results-pass';

  const buttonValue = `button[value=${value}]`;

  browser.elements('css selector', buttonValue, links => {
    for (let i = 0; i < links.value.length; i++) {
      browser.pause(1000).elementIdClick(links.value[i].ELEMENT);
    }
    browser.expect.element(`div.${visibleResultClass}`).to.be.visible;
    browser.expect.element(`div.${notPresentResultClass}`).to.not.be.present;
  });
}
module.exports = E2eHelpers.createE2eTest(browser => {
  browser
    .url(`${E2eHelpers.baseUrl}/covid19screen`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  const incompleteClass = 'covid-screener-results-incomplete';
  browser.expect.element(`div.${incompleteClass}`).to.be.visible;

  testEndStateForAnswer(browser, 'no');
  testEndStateForAnswer(browser, 'yes');

  browser.end();
});

// TODO: get correct module disable logic from VFS team
/*
to run locally:

yarn fetch-drupal-cache
NODE_ENV=production yarn build --buildtype vagovprod
yarn watch
yarn test:e2e src/applications/coronavirus-screener/tests/00.coronavirus-screener.e2e.spec.js

*/

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
