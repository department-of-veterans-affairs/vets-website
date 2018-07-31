const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../complaint-tool/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const PageHelpers = require('./complaint-tool-helpers');
// const testData = require('./schema/maximal-test.json');
// const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest((client) => {
  client
    .url(`${E2eHelpers.baseUrl}/education/complaint-tool/form`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  // applicant information
  client.waitForElementVisible('input[name="root_claimantFullName_first"]', Timeouts.normal)
    .axeCheck('.main');
  PageHelpers.completeApplicantInformation(client);

  client.end();
});

// module.exports['@disabled'] = !manifest.production;
