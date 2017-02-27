const mock = require('./mock-helpers');
const testData = require('../edu-benefits/1995/schema/maximal-test.json');

// Create API routes
function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/education_benefits_claims/1995',
    verb: 'post',
    value: {
      data: {
        attributes: {
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16',
          regionalOffice: 'Test'
        }
      }
    }
  });
}

function completeVeteranInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="root_veteranFullName_first"]')
    .setValue('input[name="root_veteranFullName_first"]', data.veteranFullName.first)
    .clearValue('input[name="root_veteranFullName_last"]')
    .setValue('input[name="root_veteranFullName_last"]', data.veteranFullName.last)
    .clearValue('input[name="root_veteranSocialSecurityNumber"]')
    .setValue('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="root_veteranFullName_middle"]', data.veteranFullName.middle)
      .setValue('select[name="root_veteranFullName_suffix"]', data.veteranFullName.suffix)
      .click('input[name="root_view:noSSN"]')
      .setValue('input[name="root_vaFileNumber"]', data.vaFileNumber);
  }
}

function completeBenefitsSelection(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('.form-radio-buttons:first-child input');
  }
}

function completeServicePeriods(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    const dateFields = data.toursOfDuty[0].dateRange.from.split('-');
    const toDateFields = data.toursOfDuty[0].dateRange.to.split('-');
    const dateFields1 = data.toursOfDuty[1].dateRange.from.split('-');
    const toDateFields1 = data.toursOfDuty[1].dateRange.to.split('-');
    client
      .click('input[name="root_view:newServiceYes"]')
      .clearValue('input[name="root_toursOfDuty_0_serviceBranch"]')
      .setValue('input[name="root_toursOfDuty_0_serviceBranch"]', data.toursOfDuty[0].serviceBranch)
      .clearValue('select[name="root_toursOfDuty_0_dateRange_fromMonth"]')
      .setValue('select[name="root_toursOfDuty_0_dateRange_fromMonth"]', 'May')
      .clearValue('select[name="root_toursOfDuty_0_dateRange_fromDay"]')
      .setValue('select[name="root_toursOfDuty_0_dateRange_fromDay"]', parseInt(dateFields[2], 10).toString())
      .clearValue('input[name="root_toursOfDuty_0_dateRange_fromYear"]')
      .setValue('input[name="root_toursOfDuty_0_dateRange_fromYear"]', parseInt(dateFields[0], 10))
      .clearValue('select[name="root_toursOfDuty_0_dateRange_toMonth"]')
      .setValue('select[name="root_toursOfDuty_0_dateRange_toMonth"]', 'Jun')
      .clearValue('select[name="root_toursOfDuty_0_dateRange_toDay"]')
      .setValue('select[name="root_toursOfDuty_0_dateRange_toDay"]', parseInt(toDateFields[2], 10).toString())
      .clearValue('input[name="root_toursOfDuty_0_dateRange_toYear"]')
      .setValue('input[name="root_toursOfDuty_0_dateRange_toYear"]', parseInt(toDateFields[0], 10))
      .click('button.va-growable-add-btn')
      .clearValue('input[name="root_toursOfDuty_1_serviceBranch"]')
      .setValue('input[name="root_toursOfDuty_1_serviceBranch"]', data.toursOfDuty[1].serviceBranch)
      .clearValue('select[name="root_toursOfDuty_1_dateRange_fromMonth"]')
      .setValue('select[name="root_toursOfDuty_1_dateRange_fromMonth"]', 'May')
      .clearValue('select[name="root_toursOfDuty_1_dateRange_fromDay"]')
      .setValue('select[name="root_toursOfDuty_1_dateRange_fromDay"]', parseInt(dateFields1[2], 10).toString())
      .clearValue('input[name="root_toursOfDuty_1_dateRange_fromYear"]')
      .setValue('input[name="root_toursOfDuty_1_dateRange_fromYear"]', parseInt(dateFields1[0], 10))
      .clearValue('select[name="root_toursOfDuty_1_dateRange_toMonth"]')
      .setValue('select[name="root_toursOfDuty_1_dateRange_toMonth"]', 'Jun')
      .clearValue('select[name="root_toursOfDuty_1_dateRange_toDay"]')
      .setValue('select[name="root_toursOfDuty_1_dateRange_toDay"]', parseInt(toDateFields1[2], 10).toString())
      .clearValue('input[name="root_toursOfDuty_1_dateRange_toYear"]')
      .setValue('input[name="root_toursOfDuty_1_dateRange_toYear"]', parseInt(toDateFields1[0], 10));
  }
}

function completeMilitaryService(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="root_view:hasServiceBefore1978Yes"]');
  }
}

function completeNewSchool(client, data, onlyRequiredFields) {
  client
    .clearValue('select[name="root_educationType"]')
    .setValue('select[name="root_educationType"]', data.educationType)
    .clearValue('input[name="root_newSchoolName"]')
    .setValue('input[name="root_newSchoolName"]', data.newSchoolName);

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
      .clearValue('input[name="root_oldSchool_address_street"]')
      .setValue('input[name="root_oldSchool_address_street"]', data.oldSchool.address.street)
      .clearValue('input[name="root_oldSchool_address_street2"]')
      .setValue('input[name="root_oldSchool_address_street2"]', data.oldSchool.address.street2)
      .clearValue('input[name="root_oldSchool_address_city"]')
      .setValue('input[name="root_oldSchool_address_city"]', data.oldSchool.address.city)
      .clearValue('select[name="root_oldSchool_address_state"]')
      .setValue('select[name="root_oldSchool_address_state"]', data.oldSchool.address.state)
      .clearValue('input[name="root_oldSchool_address_postalCode"]')
      .setValue('input[name="root_oldSchool_address_postalCode"]', data.oldSchool.address.postalCode)
      .clearValue('select[name="root_trainingEndDateMonth"]')
      .setValue('select[name="root_trainingEndDateMonth"]', 'Jun')
      .clearValue('select[name="root_trainingEndDateDay"]')
      .setValue('select[name="root_trainingEndDateDay"]', parseInt(dateFields[2], 10).toString())
      .clearValue('input[name="root_trainingEndDateYear"]')
      .setValue('input[name="root_trainingEndDateYear"]', dateFields[0])
      .setValue('input[name="root_reasonForChange"]', data.reasonForChange);
  }
}

function completeContactInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="root_veteranAddress_street"]')
    .setValue('input[name="root_veteranAddress_street"]', data.veteranAddress.street)
    .clearValue('input[name="root_veteranAddress_street2"]')
    .setValue('input[name="root_veteranAddress_street2"]', data.veteranAddress.street2)
    .clearValue('input[name="root_veteranAddress_city"]')
    .setValue('input[name="root_veteranAddress_city"]', data.veteranAddress.city)
    .clearValue('select[name="root_veteranAddress_state"]')
    .setValue('select[name="root_veteranAddress_state"]', data.veteranAddress.state)
    .clearValue('input[name="root_veteranAddress_postalCode"]')
    .setValue('input[name="root_veteranAddress_postalCode"]', data.veteranAddress.postalCode)
    .clearValue('input[name="root_view:otherContactInfo_email"]')
    .setValue('input[name="root_view:otherContactInfo_email"]', data['view:otherContactInfo'].email)
    .clearValue('input[name="root_view:otherContactInfo_view:confirmEmail"]')
    .setValue('input[name="root_view:otherContactInfo_view:confirmEmail"]', data['view:otherContactInfo']['view:confirmEmail']);

  if (!onlyRequiredFields) {
    client
      .click('input[name="root_preferredContactMethod_2"]')
      .clearValue('input[name="root_view:otherContactInfo_homePhone"]')
      .setValue('input[name="root_view:otherContactInfo_homePhone"]', data['view:otherContactInfo'].homePhone)
      .clearValue('input[name="root_view:otherContactInfo_mobilePhone"]')
      .setValue('input[name="root_view:otherContactInfo_mobilePhone"]', data['view:otherContactInfo'].mobilePhone);
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

function completeDirectDeposit(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="root_bankAccountChange_1"]')
      .setValue('input[name="root_bankAccount_accountNumber"]', data.bankAccount.accountNumber)
      .setValue('input[name="root_bankAccount_routingNumber"]', data.bankAccount.routingNumber);
  }
}

module.exports = {
  testData,
  initApplicationSubmitMock,
  completeVeteranInformation,
  completeMilitaryService,
  completeServicePeriods,
  completeContactInformation,
  completeBenefitsSelection,
  completeNewSchool,
  completeOldSchool,
  completeDependents,
  completeDirectDeposit
};
