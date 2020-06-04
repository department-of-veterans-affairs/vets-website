const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const FacilityHelpers = require('./facility-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  client.openUrl(`https://staging.va.gov/find-locations/`);

  E2eHelpers.overrideSmoothScrolling(client);
  FacilityHelpers.initApplicationMock();

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.facility-locator', Timeouts.slow)
    .axeCheck('.main');

  client
    .clearValue('input[name="street-city-state-zip"]')
    .setValue('input[name="street-city-state-zip"]', 'Dallas, TX');

  client
    .click('input[type="submit"]')
    .waitForElementVisible('.facility-result', Timeouts.verySlow)
    .axeCheck('.main');

  // check detail pages
  client
    .waitForElementVisible('.facility-result a', Timeouts.verySlow)
    .click('.facility-result a')
    .waitForElementVisible('.all-details', Timeouts.verySlow)
    .axeCheck('.main');

  client.end();
});
