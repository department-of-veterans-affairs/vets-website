const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../manifest.json');
const registry = require('applications/registry.json');

const passClass = 'covid-screener-results-pass';
const failClass = 'covid-screener-results-fail';

function resetBrowser(browser) {
  browser
    .url(`${E2eHelpers.baseUrl}/covid19screen`)
    .waitForElementVisible('body', Timeouts.normal);
}
function testIncompleteOnLoad(browser) {
  const incompleteClass = 'covid-screener-results-incomplete';
  browser.expect.element(`div.${incompleteClass}`).to.be.visible;
}

// tests end state when all answers are the same, e.g. yes or no
function testEndStateForAnswer(browser, value) {
  resetBrowser(browser);
  const visibleResultClass = value === 'no' ? passClass : failClass;
  const notPresentResultClass = value === 'no' ? failClass : passClass;
  const buttonValue = `button[value=${value}]`;

  browser.elements('css selector', buttonValue, links => {
    for (let i = 0; i < links.value.length; i++) {
      browser.pause(1000).elementIdClick(links.value[i].ELEMENT);
    }
  });
  browser.expect.element(`div.${visibleResultClass}`).to.be.visible;
  browser.expect.element(`div.${notPresentResultClass}`).to.not.be.present;
  browser.axeCheck('.main');
}

function testEndStateForMixedAnswers(browser) {
  resetBrowser(browser);
  browser.elements('css selector', `button[value=no]`, links => {
    for (let i = 0; i < links.value.length; i += 2) {
      browser.pause(1000).elementIdClick(links.value[i].ELEMENT);
    }
  });
  browser.elements('css selector', `button[value=yes]`, links => {
    for (let i = 1; i < links.value.length; i += 2) {
      browser.pause(1000).elementIdClick(links.value[i].ELEMENT);
    }
  });
  browser.expect.element(`div.${failClass}`).to.be.visible;
  browser.expect.element(`div.${passClass}`).to.not.be.present;
  browser.axeCheck('.main');
}

module.exports = E2eHelpers.createE2eTest(browser => {
  resetBrowser(browser);
  browser.axeCheck('.main');

  testIncompleteOnLoad(browser);
  testEndStateForAnswer(browser, 'no');
  testEndStateForAnswer(browser, 'yes');
  testEndStateForMixedAnswers(browser);

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
