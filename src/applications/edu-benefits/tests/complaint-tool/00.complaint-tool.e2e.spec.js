const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../gi-bill-school-feedback/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest((client) => {
  client
    .url(`${E2eHelpers.baseUrl}/education/gi-bill-school-feedback/form`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] = !manifest.production;
