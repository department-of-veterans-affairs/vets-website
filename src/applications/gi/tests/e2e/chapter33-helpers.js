const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const GiHelpers = require('./gibct-helpers');

// Search for an institution with Ch33 Benefit, select In Person or Online radio, and click result
const searchCh33 = (client, inPersonOrOnlineRadio, search, result) => {
  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .waitForElementPresent(inPersonOrOnlineRadio, Timeouts.normal)
    .click(inPersonOrOnlineRadio)
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', search)
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main')
    .waitForElementVisible(result, Timeouts.normal)
    .click('body')
    .click(result)
    .waitForElementVisible('body', 1000)
    .axeCheck('.main');
};

// Selects VA rate or DOD rate, Verifies Housing rate
const verifyCh33 = (client, expectedRateDOD, expectedRateVA, radioID) => {
  client
    .waitForElementPresent(`#radio-buttons-${radioID}-0`, Timeouts.normal)
    .click(`#radio-buttons-${radioID}-0`)
    .waitForElementVisible(GiHelpers.housingRate, Timeouts.normal)
    .assert.containsText(GiHelpers.housingRate, expectedRateVA)
    .waitForElementPresent(`#radio-buttons-${radioID}-1`, Timeouts.normal)
    .click(`#radio-buttons-${radioID}-1`)
    .waitForElementVisible(GiHelpers.housingRate, Timeouts.normal)
    .assert.containsText(GiHelpers.housingRate, expectedRateDOD);
};

module.exports = {
  searchCh33,
  verifyCh33,
};
