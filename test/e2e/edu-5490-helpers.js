// const selectDropdown = require('./e2e-helpers.js').selectDropdown;

// function completeEducationHistory(client, data, onlyRequiredFields) {
//   if (!onlyRequiredFields) {
//
//   }
// }

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

function completeBenefitRelinquishment(client, data) {
  const date = data.benefitRelinquishment.split('-');
  client
    .selectDropdown('root_benefitsRelinquishedDateMonth', date[1])
    .selectDropdown('root_benefitsRelinquishedDateDay', date[2])
    .resetValue('input[name="root_benefitsRelinquishedDateYear"]', date[0]);
}

function completeBenefitHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const { previousBenefits } = data;
    client
      .clickIf('input[name="root_previousBenefits_view:noPreviousBenefits"]', previousBenefits['view:noPreviousBenefits'])
      .clickIf('input[name="root_previousBenefits_disability"]', previousBenefits.disability)
      .clickIf('input[name="root_previousBenefits_dic"]', previousBenefits.dic)
      .clickIf('input[name="root_previousBenefits_chapter31"]', previousBenefits.chapter31);

    if (previousBenefits['view:ownServiceBenefits']) {
      client
        .click('input[name="root_previousBenefits_view:ownServiceBenefits"]')
        .resetValue('input[name="root_previousBenefits_ownServiceBenefits"]', previousBenefits.ownServiceBenefits);
    }

    if (previousBenefits['view:claimedSponsorService']) {
      client
        .click('input[name="root_previousBenefits_view:claimedSponsorService"]')
        .clickIf('input[name="root_previousBenefits_chapter35"]', previousBenefits.chapter35)
        .clickIf('input[name="root_previousBenefits_chapter33"]', previousBenefits.chapter33)
        .clickIf('input[name="root_previousBenefits_transferOfEntitlement"]', previousBenefits.transferOfEntitlement)
        .resetValue('input[name="root_previousBenefits_veteranFullName_first"]', previousBenefits.veteranFullName.first)
        .resetValue('input[name="root_previousBenefits_veteranFullName_middle"]', previousBenefits.veteranFullName.middle)
        .resetValue('input[name="root_previousBenefits_veteranFullName_last"]', previousBenefits.veteranFullName.last)
        .selectDropdown('root_previousBenefits_veteranFullName_suffix', previousBenefits.veteranFullName.suffix)
        .resetValue('input[name="root_previousBenefits_veteranSocialSecurityNumber"]', previousBenefits.veteranSocialSecurityNumber);
    }

    client.resetValue('root_previousBenefits_other', previousBenefits.other);
  }
}

module.exports = {
  // completeEducationHistory,
  completeEmploymentHistory,
  completeBenefitRelinquishment,
  completeBenefitHistory
};
