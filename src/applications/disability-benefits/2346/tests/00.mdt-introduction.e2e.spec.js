const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../manifest.json');
const environments = require('../../../../site/constants/environments');

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .url(`${E2eHelpers.baseUrl}/mdt/2346`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

// TODO: Remove this when CI builds temporary landing pages to run e2e tests
module.exports['@disabled'] =
  manifest.e2eTestsDisabled && process.env.BUILDTYPE !== environments.LOCALHOST;
