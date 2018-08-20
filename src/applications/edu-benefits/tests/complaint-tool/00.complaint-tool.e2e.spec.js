const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
// const manifest = require('../../complaint-tool/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const PageHelpers = require('./complaint-tool-helpers');
// const testData = require('./schema/maximal-test.json');
const testData = require('./schema/maximal-test.json');
// const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest((client) => {
  // subway page
  client
    .url(`${E2eHelpers.baseUrl}/education/complaint-tool/form/introduction`)
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.usa-button-primary', Timeouts.slow)
    .axeCheck('.main')
    .click('.usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // applicant information
  client.waitForElementVisible('label[for="root_onBehalfOf_0"]', Timeouts.normal);
  PageHelpers.completeApplicantInformation(client, testData.data);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  // contact information
  client.waitForElementVisible('[id="root_address_street"]', Timeouts.normal);
  PageHelpers.completeContactInformation(client, testData.data);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  // benefits information
  PageHelpers.completeBenefitsInformation(client);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  // school information
  // Note: I haven't been able to test this without the mock submission
  client.waitForElementVisible('.search-input input', Timeouts.normal).axeCheck('.main');
  PageHelpers.completeSchoolInformation(client, testData.data);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  // issue information
  PageHelpers.completeFeedbackInformation(client, testData.data);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  client.end();
});

// module.exports['@disabled'] = !manifest.production;
