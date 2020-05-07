const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const UtilHelpers = require('../../utils/helpers');
const deaSearchResults = require('../data/dea-search-results.json');
const institutionProfile = require('../data/institution-profile.json');
const ojtProfile = require('../data/ojt-profile.json');

const searchString = 'WISCONSIN';
const eybSections = {
  yourBenefits: 'Your benefits',
  learningFormatAndSchedule: 'Learning format and schedule',
};

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

/**
 * Loops through all "Enrolled" options for an institution and verifies the DEA housing rate
 * @param client
 */
// const enrolled = client => {};

/**
 * This is expanded by default
 * Inputs will be different than category=schools and ch33
 * @param client
 */
const yourBenefits = client => {
  GiHelpers.checkYourBenefits(client, eybSections);
  // enrolled(client);
};

/**
 * Loops through all "Enrolled" options for an ojt facility and verifies the DEA housing rate
 * @param client
 */
const willBeWorking = client => {
  const housingRateId = `#calculator-result-row-${UtilHelpers.createId(
    'Housing allowance',
  )} h5`;
  const deaEnrolledMax = 30;
  for (let i = 2; i <= deaEnrolledMax; i += 2) {
    const value = Math.round(
      (i / deaEnrolledMax) *
        GiHelpers.formatNumber(GiHelpers.calculatorConstants.DEARATEOJT),
    );
    client.waitForElementVisible(housingRateId, Timeouts.normal);
    client.selectDropdown('working', i);
    GiHelpers.calculateBenefits(client);
    client.assert.containsText(housingRateId, `$${value}/mo`);
  }
};

/**
 * Questions will be different than category=schools
 * @param client
 */
const learningFormatAndSchedule = client => {
  GiHelpers.openLearningFormatAndSchedule(client, eybSections);
  willBeWorking(client);
};

module.exports = {
  initApplicationMock,
  searchString,
  searchAsDEA,
  verifySearchResults,
  verifyDEA,
  yourBenefits,
  learningFormatAndSchedule,
};
