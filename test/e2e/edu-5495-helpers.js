const EduHelpers = require('./edu-helpers');

function completeMilitaryService(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="root_view:hasServiceBefore1978Yes"]');
  }
}

function completeNewSchool(client, data, onlyRequiredFields) {
  client
    .fill('select[name="root_educationType"]', data.educationType)
    .fill('input[name="root_newSchoolName"]', data.newSchoolName);

  if (!onlyRequiredFields) {
    client
      .clearValue('input[name="root_newSchoolAddress_street"]')
      .setValue('input[name="root_newSchoolAddress_street"]', data.newSchoolAddress.street)
      .clearValue('input[name="root_newSchoolAddress_street2"]')
      .setValue('input[name="root_newSchoolAddress_street2"]', data.newSchoolAddress.street2)
      .clearValue('input[name="root_newSchoolAddress_city"]')
      .setValue('input[name="root_newSchoolAddress_city"]', data.newSchoolAddress.city)
      .clearValue('select[name="root_newSchoolAddress_state"]')
      .setValue('select[name="root_newSchoolAddress_state"]', data.newSchoolAddress.state)
      .clearValue('input[name="root_newSchoolAddress_postalCode"]')
      .setValue('input[name="root_newSchoolAddress_postalCode"]', data.newSchoolAddress.postalCode)
      .setValue('textarea[id="root_educationObjective"]', data.educationObjective)
      .click('input[name=root_nonVaAssistanceYes]')
      .click('input[name=root_civilianBenefitsAssistanceNo]');
  }
}

function completeOldSchool(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="root_oldSchool_name"]')
    .setValue('input[name="root_oldSchool_name"]', data.oldSchool.name);

  if (!onlyRequiredFields) {
    const dateFields = data.trainingEndDate.split('-');
    client
      .fill('input[name="root_oldSchool_address_street"]', data.oldSchool.address.street)
      .fill('input[name="root_oldSchool_address_street2"]', data.oldSchool.address.street2)
      .fill('input[name="root_oldSchool_address_city"]', data.oldSchool.address.city)
      .fill('select[name="root_oldSchool_address_state"]', data.oldSchool.address.state)
      .fill('input[name="root_oldSchool_address_postalCode"]', data.oldSchool.address.postalCode)
      .fill('select[name="root_trainingEndDateMonth"]', 'Jun')
      .fill('select[name="root_trainingEndDateDay"]', parseInt(dateFields[2], 10).toString())
      .fill('input[name="root_trainingEndDateYear"]', dateFields[0])
      .fill('input[name="root_reasonForChange"]', data.reasonForChange);
  }
}


function completeDependents(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="root_serviceBefore1977_marriedYes"]')
      .click('input[name="root_serviceBefore1977_haveDependentsYes"]')
      .click('input[name="root_serviceBefore1977_parentDependentYes"]');
  }
}

function completeSponsorInformation(client, data) {
  EduHelpers.completeVeteranInformation(client,
    data,
    false
  );
  client
    .click('input[name="root_outstandingFelonyYes"]');
}

module.exports = {
  completeMilitaryService,
  completeNewSchool,
  completeOldSchool,
  completeSponsorInformation,
  completeDependents
};
