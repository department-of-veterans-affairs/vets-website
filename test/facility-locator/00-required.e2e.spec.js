const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const FacilityHelpers = require('../e2e/facility-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(`${E2eHelpers.baseUrl}/facilities/`);

    E2eHelpers.overrideSmoothScrolling(client);
    FacilityHelpers.initApplicationMock();

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.facility-locator', Timeouts.slow)
      .axeCheck('.main');

    client
      .clearValue('input[name="streetCityStateZip"]')
      .setValue('input[name="streetCityStateZip"]', 'Seattle, WA');

    client
      .click('input[type="submit"]')
      .waitForElementVisible('.facility-result', Timeouts.normal)
      .axeCheck('.main');

    // check detail pages
    client
      .waitForElementVisible('.facility-result a h5', Timeouts.normal)
      .click('.facility-result a h5')
      .waitForElementVisible('.facility-detail', Timeouts.slow)
      .axeCheck('.main');

    client.end();
  });
