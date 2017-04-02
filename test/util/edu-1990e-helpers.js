const selectDropdown = require('./e2e-helpers.js').selectDropdown;

function completeEducationHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const hsDateFields = data.highSchoolOrGedCompletionDate.split('-');
    const postHighSchoolTraining = data.postHighSchoolTrainings[0];
    const fromDateFields = postHighSchoolTraining.dateRange.from.split('-');
    const toDateFields = postHighSchoolTraining.dateRange.to.split('-');
    client
      .clearValue('input[name="root_highSchoolOrGedCompletionDateYear"]')
      .setValue('input[name="root_highSchoolOrGedCompletionDateYear"]', parseInt(hsDateFields[0], 10).toString())
      .clearValue('input[name="root_postHighSchoolTrainings_0_name"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_name"]', postHighSchoolTraining.name)
      .clearValue('input[name="root_postHighSchoolTrainings_0_city"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_city"]', postHighSchoolTraining.city)
      .clearValue('input[name="root_postHighSchoolTrainings_0_dateRange_fromYear"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_dateRange_fromYear"]', parseInt(fromDateFields[0], 10).toString())
      .clearValue('input[name="root_postHighSchoolTrainings_0_dateRange_toYear"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_dateRange_toYear"]', parseInt(toDateFields[0], 10).toString())
      .clearValue('input[name="root_postHighSchoolTrainings_0_hours"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_hours"]', postHighSchoolTraining.hours)
      .clearValue('input[name="root_postHighSchoolTrainings_0_degreeReceived"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_degreeReceived"]', postHighSchoolTraining.degreeReceived)
      .clearValue('input[name="root_postHighSchoolTrainings_0_major"]')
      .setValue('input[name="root_postHighSchoolTrainings_0_major"]', postHighSchoolTraining.major)
      .clearValue('textarea[id="root_faaFlightCertificatesInformation"]')
      .setValue('textarea[id="root_faaFlightCertificatesInformation"]', data.faaFlightCertificatesInformation);
    selectDropdown(client, 'root_highSchoolOrGedCompletionDateMonth', parseInt(hsDateFields[1], 10).toString());
    selectDropdown(client, 'root_highSchoolOrGedCompletionDateDay', parseInt(hsDateFields[2], 10).toString());
    selectDropdown(client, 'root_postHighSchoolTrainings_0_state', postHighSchoolTraining.state);
    selectDropdown(client, 'root_postHighSchoolTrainings_0_hoursType', postHighSchoolTraining.hoursType);
    selectDropdown(client, 'root_postHighSchoolTrainings_0_dateRange_fromMonth', parseInt(fromDateFields[1], 10).toString());
    selectDropdown(client, 'root_postHighSchoolTrainings_0_dateRange_fromDay', parseInt(fromDateFields[2], 10).toString());
    selectDropdown(client, 'root_postHighSchoolTrainings_0_dateRange_toMonth', parseInt(toDateFields[1], 10).toString());
    selectDropdown(client, 'root_postHighSchoolTrainings_0_dateRange_toDay', parseInt(toDateFields[2], 10).toString());
  }
}

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
