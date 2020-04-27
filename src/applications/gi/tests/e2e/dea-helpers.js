const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

// Selects DEA as benefit type, searches for schools in washington dc, checks the housing rate of the expected result, and clicks the expected result
const searchAsDEA = (client, institutionAttributes) => {
  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35')
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue(
      '.keyword-search input[type="text"]',
      `${institutionAttributes.city} ${institutionAttributes.state}`,
    )
    .click('#search-button');
};

const verifySearchResults = (
  client,
  facilityCode,
  resultRate,
  expectedRate,
) => {
  const expectedResult = `${facilityCode}-search-result`;

  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');
  client.expect.element(expectedResult).to.be.enabled.before(Timeouts.normal);
  client.assert.containsText(resultRate, expectedRate);
};

// Verify the expected DEA housing rate for the selected "Enrolled" option
const verifyDEA = (client, enrolledOption, expectedDEA) => {
  client
    .selectDropdown('enrolledOld', enrolledOption)
    .waitForElementVisible(GiHelpers.housingRate, Timeouts.normal)
    .assert.containsText(GiHelpers.housingRate, expectedDEA);
};

module.exports = {
  searchAsDEA,
  verifySearchResults,
  verifyDEA,
};
