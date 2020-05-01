const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const deaSearchResults = require('../data/dea-search-results.json');
const institutionProfile = require('../data/institution-profile.json');
const ojtProfile = require('../data/ojt-profile.json');

// const deaEnrolledMax = 30;
const searchString = 'WISCONSIN';

// Create API routes
const initApplicationMock = () => {
  GiHelpers.initApplicationMock(institutionProfile, deaSearchResults);

  GiHelpers.initMockProfile(ojtProfile);
  GiHelpers.initCommonMock();
};

// Selects DEA as benefit type
const searchAsDEA = client => {
  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35')
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', searchString)
    .click('#search-button');
};

const verifySearchResults = client => {
  GiHelpers.verifySearchResults(client, deaSearchResults);
  client.selectRadio('category', 'ALL');

  deaSearchResults.data.forEach(({ attributes: profile }) => {
    let housingRate = GiHelpers.formatCurrency(
      GiHelpers.calculatorConstants.DEARATEFULLTIME,
    );

    if (profile.type === 'OJT') {
      housingRate = GiHelpers.formatCurrency(
        GiHelpers.calculatorConstants.DEARATEOJT,
      );
    }
    client.assert.containsText(
      `#housing-value-${profile.facility_code}`,
      housingRate,
    );
  });
};

// Verify the expected DEA housing rate for the selected "Enrolled" option
const verifyDEA = (client, enrolledOption, expectedDEA) => {
  client
    .selectDropdown('enrolledOld', enrolledOption)
    .waitForElementVisible(GiHelpers.housingRate, Timeouts.normal)
    .assert.containsText(GiHelpers.housingRate, expectedDEA);
};

module.exports = {
  initApplicationMock,
  searchString,
  searchAsDEA,
  verifySearchResults,
  verifyDEA,
};
