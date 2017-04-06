import _ from 'lodash/fp';

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

// This section is required, unlike the regular EduHelpers
// Also actually uses the data
function completeBenefitSelection(client, data) {
  client.click(`input[value="${data.benefit}"]`);
}

function completeBenefitRelinquishment(client, data) {
  const date = data.benefitsRelinquishedDate.split('-');
  client
    .selectDropdown('root_benefitsRelinquishedDateMonth', date[1])
    .selectDropdown('root_benefitsRelinquishedDateDay', date[2])
    .fill('input[name="root_benefitsRelinquishedDateYear"]', date[0]);
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
        .fill('input[name="root_previousBenefits_ownServiceBenefits"]', previousBenefits.ownServiceBenefits);
    }

    if (previousBenefits['view:claimedSponsorService']) {
      client
        .click('input[name="root_previousBenefits_view:claimedSponsorService"]')
        .clickIf('input[name="root_previousBenefits_chapter35"]', previousBenefits.chapter35)
        .clickIf('input[name="root_previousBenefits_chapter33"]', previousBenefits.chapter33)
        .clickIf('input[name="root_previousBenefits_transferOfEntitlement"]', previousBenefits.transferOfEntitlement)
        .fill('input[name="root_previousBenefits_veteranFullName_first"]', previousBenefits.veteranFullName.first)
        .fill('input[name="root_previousBenefits_veteranFullName_middle"]', previousBenefits.veteranFullName.middle)
        .fill('input[name="root_previousBenefits_veteranFullName_last"]', previousBenefits.veteranFullName.last)
        .selectDropdown('root_previousBenefits_veteranFullName_suffix', previousBenefits.veteranFullName.suffix)
        .fill('input[name="root_previousBenefits_veteranSocialSecurityNumber"]', previousBenefits.veteranSocialSecurityNumber);
    }

    client.fill('input[name="root_previousBenefits_other"]', previousBenefits.other);
  }
}

function completeSponsorService(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const activeDuty = `root_currentlyActiveDuty${data.currentlyActiveDuty ? 'Yes' : 'No'}`;
    const felony = `root_outstandingFelony${data.outstandingFelony ? 'Yes' : 'No'}`;
    client
      .fill('input[name="root_serviceBranch"]', data.serviceBranch)
      .click(`input[name="${activeDuty}"]`)
      .click(`input[name="${felony}"]`);
  }
}

function completeSecondaryContact(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const { address } = data;
    client
      .fill('input[name="root_secondaryContact_fullName"]', data.fullName)
      .fill('input[name="root_secondaryContact_phone"]', data.phone)
      .selectDropdown('root_secondaryContact_address_country', address.country)
      .fill('input[name="root_secondaryContact_address_street"]', address.street)
      .fill('input[name="root_secondaryContact_address_street2"]', address.street2)
      .fill('input[name="root_secondaryContact_address_city"]', address.city)
      .selectDropdown('root_secondaryContact_address_state', address.state)
      .fill('input[name="root_secondaryContact_address_postalCode"]', address.postalCode);
  }
}

function completeEducationHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    let completionDate = _.get('highSchool.highSchoolOrGedCompletionDate', data);

    client.selectDropdown('root_highSchool_status', data.highSchool.status);
    if (completionDate) {
      completionDate = completionDate.split('-');
      client
        .selectDropdown('root_highSchool_view:highSchoolOrGedCompletionDateMonth', completionDate[1])
        .selectDropdown('root_highSchool_view:highSchoolOrGedCompletionDateDay', completionDate[2])
        .fill('input[name="root_highSchool_view:highSchoolOrGedCompletionDateYear"]', completionDate[0]);
    }

    if (!_.isEmpty(data.postHighSchoolTrainings)) {
      // Open up the trainings section if there are trainings in the data
      client.click('input[name="root_view:hasTrainingsYes"]');

      // Fill out the information for each training
      _.forEach(data.postHighSchoolTrainings, (training, index, allTrainings) => {
        let dateFrom = _.get('dateRange.from', training);
        let dateTo = _.get('dateRange.to', training);

        client
          .fill(`input[name="root_postHighSchoolTrainings_${index}_name"]`, training.name)
          .fill(`input[name="root_postHighSchoolTrainings_${index}_city"]`, training.city)
          .selectDropdown(`root_postHighSchoolTrainings_${index}_state`, training.state);

        if (dateFrom) {
          dateFrom = dateFrom.split('-');
          client
            .selectDropdown(`root_postHighSchoolTrainings_${index}_dateRange_fromMonth`, dateFrom[1])
            .selectDropdown(`root_postHighSchoolTrainings_${index}_dateRange_fromDay`, dateFrom[2])
            .fill(`input[name="root_postHighSchoolTrainings_${index}_dateRange_fromYear"]`, dateFrom[0]);
        }
        if (dateTo) {
          dateTo = dateTo.split('-');
          client
            .selectDropdown(`root_postHighSchoolTrainings_${index}_dateRange_toMonth`, dateTo[1])
            .selectDropdown(`root_postHighSchoolTrainings_${index}_dateRange_toDay`, dateTo[2])
            .fill(`input[name="root_postHighSchoolTrainings_${index}_dateRange_toYear"]`, dateTo[0]);
        }

        client
          .fill(`input[name="root_postHighSchoolTrainings_${index}_hours"]`, training.hours)
          .selectDropdown(`root_postHighSchoolTrainings_${index}_hoursType`, training.hoursType)
          .fill(`input[name="root_postHighSchoolTrainings_${index}_degreeReceived"]`, training.degreeReceived)
          .fill(`input[name="root_postHighSchoolTrainings_${index}_major"]`, training.major);

        // If this isn't the last training, add another
        if (allTrainings[index + 1]) {
          client.click('button.va-growable-add-btn');
        }
      });
    }
  }
}

module.exports = {
  // completeEducationHistory,
  completeEmploymentHistory,
  completeBenefitSelection,
  completeBenefitRelinquishment,
  completeBenefitHistory,
  completeSponsorService,
  completeSecondaryContact,
  completeEducationHistory
};
