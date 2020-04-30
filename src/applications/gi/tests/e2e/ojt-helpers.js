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
 * This is expanded by default than category=schools
 * Inputs will be different
 * @param client
 */
const yourBenefits = client => {
  GiHelpers.yourBenefits(client, eybSections);
};

/**
 * Inputs will be different than category=schools
 * @param client
 */
const learningFormatAndSchedule = client => {
  GiHelpers.learningFormatAndSchedule(client, eybSections);
};

/**
 * Inputs will be different than category=schools
 * @param client
 */
const scholarshipsAndOtherFunding = client => {
  GiHelpers.scholarshipsAndOtherFunding(client, eybSections);
};

module.exports = {
  selectOJTType,
  yourBenefits,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
