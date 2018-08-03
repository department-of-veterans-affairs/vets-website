const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
// const manifest = require('../../complaint-tool/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const PageHelpers = require('./complaint-tool-helpers');
const testData = require('./schema/maximal-test.json');
// const testData = require('./schema/maximal-test.json');
// const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest((client) => {
  client
    .url(`${E2eHelpers.baseUrl}/education/complaint-tool/form/introduction`)
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.usa-button-primary', Timeouts.slow)
    .axeCheck('.main')
    .click('.usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');


  // TODO: Fix this!
  // applicant information
  // client.waitForElementVisible('label [for="root_onBehalfOf"]', Timeouts.normal).axeCheck('.main');
  PageHelpers.completeApplicantInformation(client, testData.data);
  client
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');

  // client.url(`${E2eHelpers.baseUrl}/education/complaint-tool/form/benefits-information`);
  // client.waitForElementVisible('label [for="root_programs_Post-9/11 Ch 33"]', Timeouts.normal).axeCheck('.main');
  // PageHelpers.completeBenefitsInformation(client, testData.data);
  // client
  //   .axeCheck('.main')
  //   .click('.form-progress-buttons .usa-button-primary');

  client.end();
});

// module.exports['@disabled'] = !manifest.production;
