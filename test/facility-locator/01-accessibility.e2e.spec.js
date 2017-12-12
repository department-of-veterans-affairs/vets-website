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
      // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
      .axeCheck('.main', { rules: ['section508'] });

    // Traverse form controls via keyboard input
    client
      .sendKeys('input[name="streetCityStateZip"]', client.Keys.TAB)
      .execute(FacilityHelpers.checkActiveElement, ['div[class="facility-dropdown-wrapper"]'], result =>
        client.assert.equal(true, result.value, 'Result matches'));

    client
      .sendKeys('div[class="facility-dropdown-wrapper"]', client.Keys.TAB)
      .execute(FacilityHelpers.checkActiveElement, ['div[class="facility-dropdown-wrapper disabled"]'], result => client.assert.equal(true, result.value, 'Result matches'));

    client
      .sendKeys('div[class="facility-dropdown-wrapper disabled"]', client.Keys.TAB)
      .execute(FacilityHelpers.checkActiveElement, ['input[type="submit"]'], result =>
        client.assert.equal(true, result.value, 'result matches'));

    // Enter and navigate custom select via keyboard input
    client
      .sendKeys('div[class="facility-dropdown-wrapper"]', client.Keys.DOWN_ARROW)
      .execute(FacilityHelpers.checkActiveElement, ['#AllFacilities'], result => client.assert.equal(true, result.value, 'Result matches'));

    client
      .assert.elementPresent('div[class="facility-dropdown-wrapper active"]');

    client
      .sendKeys('#AllFacilities', client.Keys.DOWN_ARROW)
      .execute(FacilityHelpers.checkActiveElement, ['#health'], result => client.assert.equal(true, result.value, 'Result matches'));

    client
      .sendKeys('#health', client.Keys.ENTER)
      .execute(FacilityHelpers.checkActiveElement, ['div[class="facility-dropdown-wrapper"]'], result => client.assert.equal(true, result.value, 'Result matches'));

    client
      .assert.elementNotPresent('div[class="facility-dropdown-wrapper active"]');

    client
      .assert.attributeContains('#health', 'aria-selected', true);

    client.end();
  });
