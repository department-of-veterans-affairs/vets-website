const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const FacilityHelpers = require('./facility-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  client.openUrl(`${E2eHelpers.baseUrl}/find-locations/`);

  E2eHelpers.overrideSmoothScrolling(client);
  FacilityHelpers.initApplicationMock();

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.facility-locator', Timeouts.slow)
    .axeCheck('.main');

  // Traverse form controls via keyboard input
  client
    .sendKeys('input[name="street-city-state-zip"]', client.Keys.TAB)
    .assert.isActiveElement('#facility-type-dropdown');

  client
    .sendKeys('#facility-type-dropdown', client.Keys.TAB)
    .assert.isActiveElement('#service-type-dropdown');

  // Enter and navigate custom select via keyboard input

  client
    .sendKeys('#facility-type-dropdown', client.Keys.DOWN_ARROW)
    .assert.visible('option[value="health"]');

  client
    .sendKeys('#facility-type-dropdown', client.Keys.DOWN_ARROW)
    .assert.visible('option[value="urgent_care"]');

  if (FacilityHelpers.ccLocatorEnabled()) {
    client
      .sendKeys('#facility-type-dropdown', client.Keys.DOWN_ARROW)
      .assert.visible('option[value="cc_provider"]');
  }

  client
    .sendKeys('#facility-type-dropdown', client.Keys.DOWN_ARROW)
    .assert.visible('option[value="urgent_care"]');

  // client.click('select option[value="urgent_care"]');
  // .sendKeys('#facility-type-dropdown', client.Keys.ENTER)
  // .waitForElementVisible('#facility-type-dropdown', Timeouts.verySlow);

  // .assert.isActiveElement('#facility-type-dropdown');

  client.end();
});
