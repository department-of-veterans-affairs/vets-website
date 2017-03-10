const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(`${E2eHelpers.baseUrl}/facilities/`);

    E2eHelpers.overrideSmoothScrolling(client);

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.facility-locator', Timeouts.slow)
      .axeCheck('.main');

    client
    .clearValue('input[name="streetCityStateZip"]')
    .setValue('input[name="streetCityStateZip"]', 'Seattle, WA');

    client
      .axeCheck('.main')
      .click('input[type="submit"]');

    client
      .axeCheck('.main');

    client.end();
  });
