const mock = require('../e2e/mock-helpers');
const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts');

const pause = 500;
const selectors = {
  root: '#feedback-root',
  revealFormButton: '.feedback-button',
  form: '.feedback-form',
  formDescription: '.feedback-form textarea',
  formShouldSendResponse: 'input[name=should-send-response]',
  formEmail: '.feedback-form input[name=email]',
  formSubmit: '.feedback-form button[type=submit]',
  formSubmitted: '#feedback-submitted'
};

function begin(browser) {
  browser.url(E2eHelpers.baseUrl)
    .waitForElementVisible(selectors.root, Timeouts.slow)
    .axeCheck('document');

  browser.click(selectors.revealFormButton).pause(pause);
  browser.setValue(selectors.formDescription, 'This is my feedback').pause(pause);
  browser.click(selectors.formShouldSendResponse).pause(pause);
  browser.setValue(selectors.formEmail, 'test@adhocteam.us').pause(pause);
  browser.click(selectors.formSubmit).pause(pause);
  browser.waitForElementPresent(selectors.formSubmitted, Timeouts.normal);
  browser.end();
}

function setup(browser) {
  mock(null, { path: '/v0/feedback', verb: 'post', value: { data: {} } })
    .then(() => begin(browser));
}

module.exports = E2eHelpers.createE2eTest(setup);
