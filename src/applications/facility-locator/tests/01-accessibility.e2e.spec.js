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
    .assert.isActiveElement('#facility-dropdown-toggle');

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.TAB)
    .assert.isActiveElement('#service-type-dropdown');

  // Enter and navigate custom select via keyboard input

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
    .assert.visible('ul[class="dropdown"]');

  if (FacilityHelpers.ccLocatorEnabled()) {
    client
      .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
      .useXpath()
      .assert.attributeContains(
        '//li[@option="VA Community Care (In network)"]',
        'aria-selected',
        true,
      );
  }

  client
    .useCss()
    .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
    .useXpath()
    .assert.attributeContains(
      '//li[@option="Urgent care"]',
      'aria-selected',
      true,
    );

  client
    .useCss()
    .sendKeys('#facility-dropdown-toggle', client.Keys.ENTER)
    .assert.isActiveElement('#facility-dropdown-toggle');

  client.waitForElementNotPresent('ul[class="dropdown"]', Timeouts.normal);

  client.end();
});
