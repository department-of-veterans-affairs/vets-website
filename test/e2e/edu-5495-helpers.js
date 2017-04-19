const EduHelpers = require('./edu-helpers');

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


function completeSponsorInformation(client, data) {
  EduHelpers.completeVeteranInformation(client,
    data,
    false
  );
  client
    .click('input[name="root_outstandingFelonyYes"]');
}

module.exports = {
  completeOldSchool,
  completeSponsorInformation
};
