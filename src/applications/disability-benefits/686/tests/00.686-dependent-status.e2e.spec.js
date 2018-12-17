const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('applications/disability-benefits/686/manifest');
const Timeouts = require('platform/testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .openUrl(`${E2eHelpers.baseUrl}/disability-benefits/686/dependent-status`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] = manifest.e2eTestsDisabled;
