const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../manifest.json');

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .url(
      `${
        E2eHelpers.baseUrl
      }/disability/file-benefits-delivery-at-discharge-form-21-526ez`,
    )
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] =
  !manifest.production || __BUILDTYPE__ !== 'production';
