const E2eHelpers = require('../../src/platform/testing/e2e/helpers');
const manifest = require('../../src/js/686/manifest.json');
const Timeouts = require('../../src/platform/testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest((client) => {
  client
    .url(`${E2eHelpers.baseUrl}/disability-benefits/686/dependent-status`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] = !manifest.production;
