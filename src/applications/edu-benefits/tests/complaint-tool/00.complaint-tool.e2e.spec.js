const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../complaint-tool/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest((client) => {
  client
    .url(`${E2eHelpers.baseUrl}/education/complaint-tool/form`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] = !manifest.production;
