const mock = require('../e2e/mock-helpers');
const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts');

const selectors = {
  root: '#feedback-root',
  revealFormButton: '#feedback-tool',
  form: '.feedback-form',
  formDescription: '.feedback-form textarea',
  formShouldSendResponse: '#shouldSendResponse-0',
  formEmail: '.feedback-form input[name=email]',
  formSubmit: '.feedback-form button[type=submit]',
  formSubmitted: '#feedback-submitted'
};

const runTest = (client) => {

  // Ensure introduction page renders.
  client
    .url(`${E2eHelpers.baseUrl}`)
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible(selectors.root, Timeouts.slow);

  client.axeCheck('document');

  // Click the feedback button to reveal the form
  client.click(selectors.revealFormButton);
  client.waitForElementVisible(selectors.form, Timeouts.normal);

  // Set actual feedback value
  client.setValue(selectors.formDescription, 'This is my feedback');

  // Set the email value
  client.click(selectors.formShouldSendResponse);

  // client.pause();
  client.waitForElementPresent(selectors.formEmail, Timeouts.normal);
  client.setValue(selectors.formEmail, 'test@adhocteam.us');

  // Click the submit button
  client.click(selectors.formSubmit);
  client.waitForElementPresent(selectors.formSubmitted, Timeouts.normal);

  client.end();
};

function setup(browser) {

  browser.perform(done => {

    mock(null, { path: '/v0/feedback', verb: 'post', value: { data: {} } })
      .then(() => runTest(browser))
      // .catch(err => console.log(err))
      .then(done);

  });
}
module.exports = E2eHelpers.createE2eTest(setup);

// module.exports = runTest;
