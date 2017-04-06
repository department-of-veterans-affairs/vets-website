// Same as 1990e
// TODO: relocate to keep it DRY
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

function completeSponsorService(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const activeDuty = `root_currentlyActiveDuty${data.currentlyActiveDuty ? 'Yes' : 'No'}`;
    const felony = `root_outstandingFelony${data.outstandingFelony ? 'Yes' : 'No'}`;
    client
      .resetValue('input[name="root_serviceBranch"]', data.serviceBranch)
      .click(`input[name="${activeDuty}"]`)
      .click(`input[name="${felony}"]`);
  }
}

function completeSecondaryContact(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const { address } = data;
    client
      .resetValue('input[name="root_secondaryContact_fullName"]', data.fullName)
      .resetValue('input[name="root_secondaryContact_phone"]', data.phone)
      .selectDropdown('root_secondaryContact_address_country', address.country)
      .resetValue('input[name="root_secondaryContact_address_street"]', address.street)
      .resetValue('input[name="root_secondaryContact_address_street2"]', address.street2)
      .resetValue('input[name="root_secondaryContact_address_city"]', address.city)
      .selectDropdown('root_secondaryContact_address_state', address.state)
      .resetValue('input[name="root_secondaryContact_address_postalCode"]', address.postalCode);
  }
}

module.exports = {
  // completeEducationHistory,
  completeEmploymentHistory,
  completeBenefitRelinquishment,
  completeBenefitHistory,
  completeSponsorService,
  completeSecondaryContact
};
