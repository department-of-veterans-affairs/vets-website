const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');

const runTest = E2eHelpers.createE2eTest(client => {
  // Navigate to intro page
  client
    .openUrl(`${E2eHelpers.baseUrl}/disability-benefits/new-686`)
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.schemaform-title', Timeouts.slow);
});

module.exports = runTest;
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
