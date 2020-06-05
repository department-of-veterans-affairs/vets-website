const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const FacilityHelpers = require('./facility-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  client.openUrl(`https://staging.va.gov/find-locations/`);
  // eslint-disable-next-line no-console
  console.log(`${E2eHelpers.apiUrl}`);

  E2eHelpers.overrideSmoothScrolling(client);
  FacilityHelpers.initApplicationMock();

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.facility-locator', Timeouts.slow)
    .axeCheck('.main');

  client
    .clearValue('input[name="street-city-state-zip"]')
    .setValue('input[name="street-city-state-zip"]', 'Seattle, WA');

  client
    .click('input[type="submit"]')
    .waitForElementVisible('.facility-result', Timeouts.normal)
    .axeCheck('.main');

  // check detail pages
  client
    .waitForElementVisible('.facility-result a', Timeouts.slow)
    .click('.facility-result a')
    .waitForElementVisible('.all-details', Timeouts.slow)
    .axeCheck('.main');

  client.end();
});
