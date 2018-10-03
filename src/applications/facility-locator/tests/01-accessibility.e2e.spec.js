const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const FacilityHelpers = require('./facility-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  client.url(`${E2eHelpers.baseUrl}/facilities/`);

  E2eHelpers.overrideSmoothScrolling(client);
  FacilityHelpers.initApplicationMock();

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.facility-locator', Timeouts.slow)
    // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
    .axeCheck('.main', { rules: ['section508'] });

  // Traverse form controls via keyboard input
  client
    .sendKeys('input[name="street-city-state-zip"]', client.Keys.TAB)
    .assert.isActiveElement('#facility-dropdown-toggle');

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.TAB)
    .assert.isActiveElement('input[type="submit"]');

  // Enter and navigate custom select via keyboard input
  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
    .assert.visible('ul[class="dropdown"]');

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
    .assert.attributeContains('.health-icon', 'aria-selected', true);

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.DOWN_ARROW)
    .assert.attributeContains('.benefits-icon', 'aria-selected', true);

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.ENTER)
    .assert.isActiveElement('#facility-dropdown-toggle');

  client.waitForElementNotPresent('ul[class="dropdown"]', Timeouts.normal);

  client
    .sendKeys('#facility-dropdown-toggle', client.Keys.TAB)
    .assert.isActiveElement('#service-type-dropdown');

  client.end();
});
