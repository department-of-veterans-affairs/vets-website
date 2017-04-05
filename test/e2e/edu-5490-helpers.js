// const selectDropdown = require('./e2e-helpers.js').selectDropdown;

function completeEducationHistory(client, data, onlyRequiredFields) {
  // if (!onlyRequiredFields) {
  // }
}

// Same as 1990e; relocate to keep it DRY
function completeEmploymentHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const nonMilitaryJobs = data.nonMilitaryJobs[0];
    client
      .click('input[name="root_view:hasNonMilitaryJobsYes"]')
      .clearValue('input[name="root_nonMilitaryJobs_0_name"]')
      .setValue('input[name="root_nonMilitaryJobs_0_name"]', nonMilitaryJobs.name)
      .clearValue('input[name="root_nonMilitaryJobs_0_months"]')
      .setValue('input[name="root_nonMilitaryJobs_0_months"]', nonMilitaryJobs.months)
      .clearValue('input[name="root_nonMilitaryJobs_0_licenseOrRating"]')
      .setValue('input[name="root_nonMilitaryJobs_0_licenseOrRating"]', nonMilitaryJobs.licenseOrRating);
  }
}

module.exports = {
  completeEducationHistory,
  completeEmploymentHistory
};
