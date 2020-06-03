/* eslint-disable array-callback-return */
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

function testIsStaffButton(browser, isStaff) {
  const isStaffButton = `button[value=${isStaff}]`;
  const firstScrollDiv = 'div[name=multi-question-form-1-scroll-element]';

  browser.waitForElementVisible(isStaffButton, Timeouts.normal);
  browser.click(isStaffButton);
  browser.waitForElementPresent(firstScrollDiv, Timeouts.normal);
}

/* tests end state when all answers are the same, e.g. yes or no
    @params: 
      isStaff: yes|no - is the user a staff member
      value: yes|no = the answer for all subsequent questions
*/
function testEndStateForAnswer(browser, value, isStaff) {
  resetBrowser(browser);
  const visibleResultClass = value === 'no' ? passClass : failClass;
  const notPresentResultClass = value === 'no' ? failClass : passClass;
  const buttonValue = `button[value=${value}]`;

  testIsStaffButton(browser, isStaff);

  browser.elements('css selector', buttonValue, buttons => {
    for (let i = 1; i < buttons.value.length; i++) {
      browser.pause(1000).elementIdClick(buttons.value[i].ELEMENT);
    }
  });
  browser.expect.element(`div.${visibleResultClass}`).to.be.visible;
  browser.expect.element(`div.${notPresentResultClass}`).to.not.be.present;
  browser.axeCheck('.main');
}

function testEndStateForMixedAnswers(browser, isStaff) {
  resetBrowser(browser);

  testIsStaffButton(browser, isStaff);

  browser.elements('css selector', `button[value=no]`, links => {
    for (let i = 2; i < links.value.length; i += 2) {
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

  const yesNo = ['yes', 'no'];
  yesNo.map(option => {
    yesNo.map(option2 => {
      testEndStateForAnswer(browser, option, option2);
    });
    testEndStateForMixedAnswers(browser, option);
  });

  browser.end();
});

// disable E2E test in CI if app is not in prod
// TODO: update per result of https://github.com/department-of-veterans-affairs/generator-vets-website/pull/27
module.exports['@disabled'] =
  registry.find(entry => entry.entryName === manifest.entryName).template
    .vagovprod !== true && __BUILDTYPE__ !== 'production';
