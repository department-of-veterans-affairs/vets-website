const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const HcaHelpers = require('../e2e/hca-helpers.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const url = `${E2eHelpers.baseUrl}/health-care/apply/application`;
    const reviewUrl = `${url}/review-and-submit?skip`;
    const token = HcaHelpers.initSaveInProgressMock(url, client);

    // Ensure introduction page renders.
    client
      .url(reviewUrl)
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.usa-button-primary', Timeouts.slow);  // First render of React may be slow.

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);

    client
      .click('.schemaform-chapter-accordion-header:first-child > .usa-button-unstyled')
      .click('.edit-btn')
      .fill('input[name="root_veteranFullName_first"]', 'Jane')
      .waitForElementVisible('.saved-success-container', Timeouts.normal);

    // save and finish a form later
    client
      .click('.schemaform-sip-save-link');

    E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    client.assert.urlContains('form-saved');

    // server error when saving in progress form
    client
      .url(reviewUrl)
      .waitForElementVisible('.schemaform-sip-save-link', Timeouts.normal)
      .mockData({
        path: '/v0/in_progress_forms/1010ez',
        verb: 'put',
        value: {},
        status: 500
      }, token)
      .pause(500)
      .click('.schemaform-sip-save-link')
      .waitForElementVisible('.usa-alert-error', Timeouts.normal);

    client.assert.urlContains('review-and-submit');
    client.expect.element('.usa-alert-error').text.to.contain('We’re sorry. Something went wrong when saving your form');

    client.end();
  });
