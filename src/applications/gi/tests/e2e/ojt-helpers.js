const Timeouts = require('platform/testing/e2e/timeouts');
const UtilHelpers = require('../../utils/helpers');

const GiHelpers = require('./gibct-helpers');

const selectOJTType = client => {
  client.selectRadio('category', 'employer');
  client.axeCheck('.main');
};

const eybSections = {
  yourBenefits: 'Your benefits',
  learningFormatAndSchedule: 'Learning format and schedule',
  scholarshipsAndOtherFunding: 'Scholarships and other funding',
};

/**
 * This is expanded by default
 * Inputs will be different than category=schools
 * @param client
 * @param sections depending on selected GI Bill Benefit not all OJT sections display
 */
const yourBenefits = (client, sections = eybSections) => {
  GiHelpers.checkYourBenefits(client, sections);
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
 * @param sections depending on selected GI Bill Benefit not all OJT sections display
 */
const learningFormatAndSchedule = (client, sections = eybSections) => {
  GiHelpers.openLearningFormatAndSchedule(client, sections);
  willBeWorking(client);
};

/**
 * Questions will be different than category=schools
 * @param client
 * @param sections depending on selected GI Bill Benefit not all OJT sections display
 */
const scholarshipsAndOtherFunding = (client, sections = eybSections) => {
  GiHelpers.openScholarshipsAndOtherFunding(client, sections);
};

module.exports = {
  selectOJTType,
  yourBenefits,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
