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
  GiHelpers.giBillChapter(client, '35');
  GiHelpers.searchForInstitution(client, searchString);
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
const enrolledOld = client => {
  const enrolledOldRates = [
    { rate: GiHelpers.calculatorConstants.DEARATEFULLTIME, option: 'full' },
    {
      rate: GiHelpers.calculatorConstants.DEARATETHREEQUARTERS,
      option: 'three quarters',
    },
    { rate: GiHelpers.calculatorConstants.DEARATEONEHALF, option: 'half' },
    {
      rate: 300,
      option: 'less than half',
    },
    {
      rate: 300,
      option: 'quarter',
    },
  ];

  enrolledOldRates.forEach(({ rate, option }) => {
    GiHelpers.enrolledOld(client, option, rate);
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
  enrolledOld,
  willBeWorking,
};
