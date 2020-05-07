const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const OjtHelpers = require('./ojt-helpers');
const deaSearchResults = require('../data/dea-search-results.json');
const institutionProfile = require('../data/institution-profile.json');
const ojtProfile = require('../data/ojt-profile.json');

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
    let housingRate = GiHelpers.calculatorConstants.DEARATEFULLTIME;
    if (profile.type === 'OJT') {
      housingRate = GiHelpers.calculatorConstants.DEARATEOJT;
    }
    client.assert.containsText(
      `#housing-value-${profile.facility_code}`,
      GiHelpers.formatCurrency(housingRate),
    );
  });
};

/**
 * Loops through all "Enrolled" options for an institution and verifies the DEA housing rate
 * @param client
 */
const enrolled = client => {
  const enrolledRates = [
    { rate: GiHelpers.calculatorConstants.DEARATEFULLTIME, option: 'full' },
    {
      rate: GiHelpers.calculatorConstants.DEARATETHREEQUARTERS,
      option: 'three quarters',
    },
    { rate: GiHelpers.calculatorConstants.DEARATEONEHALF, option: 'half' },
    {
      rate: GiHelpers.calculatorConstants.DEARATEUPTOONEHALF,
      option: 'less than half',
    },
    {
      rate: GiHelpers.calculatorConstants.DEARATEUPTOONEQUARTER,
      option: 'quarter',
    },
  ];

  enrolledRates.forEach(({ rate, option }) => {
    client
      .waitForElementVisible('enrolled', Timeouts.normal)
      .selectDropdown('enrolled', option);
    GiHelpers.calculateBenefits(client);
    client
      .waitForElementVisible(GiHelpers.housingRateId, Timeouts.normal)
      .assert.containsText(
        GiHelpers.housingRateId,
        GiHelpers.formatCurrency(rate),
      );
  });
};

/**
 * Loops through all "working" options for an ojt facility and verifies the DEA housing rate
 * @param client
 */
const willBeWorking = client => {
  const deaEnrolledMax = 30;
  for (let i = 2; i <= deaEnrolledMax; i += 2) {
    const value = Math.round(
      (i / deaEnrolledMax) *
        GiHelpers.formatNumber(GiHelpers.calculatorConstants.DEARATEOJT),
    );
    OjtHelpers.willBeWorking(client, i, value);
  }
};

module.exports = {
  initApplicationMock,
  searchString,
  searchAsDEA,
  verifySearchResults,
  enrolled,
  willBeWorking,
};
