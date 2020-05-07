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
 */
const yourBenefits = client => {
  GiHelpers.checkYourBenefits(client, eybSections);
};

/**
 * Questions will be different than category=schools
 * @param client
 */
const learningFormatAndSchedule = client => {
  GiHelpers.openLearningFormatAndSchedule(client, eybSections);
};

/**
 * Questions will be different than category=schools
 * @param client
 */
const scholarshipsAndOtherFunding = client => {
  GiHelpers.openScholarshipsAndOtherFunding(client, eybSections);
};

module.exports = {
  selectOJTType,
  yourBenefits,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
