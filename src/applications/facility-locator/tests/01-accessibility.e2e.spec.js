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
  // Focus on address/location input
  client.sendKeys('input[name="street-city-state-zip"]', 'Austin');
  client.assert.isActiveElement('input[name="street-city-state-zip');

  // Navigate to facility dropdown and interact with some options
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement('#facility-type-dropdown');
  client.keys(client.Keys.DOWN_ARROW);
  client.pause(1000);
  client.assert.visible('select option[value="health"]');
  client.keys(client.Keys.DOWN_ARROW);
  client.assert.visible('select option[value="urgent_care"]');

  // Navigate to service dropdown and interact with some options
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement('#service-type-dropdown');
  client.keys(client.Keys.DOWN_ARROW);
  client.pause(1000);
  client.assert.visible('select option[value="PrimaryCare"]');
  client.keys(client.Keys.DOWN_ARROW);
  client.assert.visible('select option[value="MentalHealthCare"]');

  // Navigate to search button
  client.keys(client.Keys.TAB);
  client.assert.isActiveElement('input[type=submit]');

  client.end();
});
