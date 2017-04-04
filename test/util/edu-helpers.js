const mock = require('./mock-helpers');
const selectDropdown = require('./e2e-helpers.js').selectDropdown;

// Create API routes
function initApplicationSubmitMock(form) {
  mock(null, {
    path: `/v0/education_benefits_claims/${form}`,
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
    .clearValue('input[name="root_view:veteranId_veteranSocialSecurityNumber"]')
    .setValue('input[name="root_view:veteranId_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="root_veteranFullName_middle"]', data.veteranFullName.middle)
      .setValue('select[name="root_veteranFullName_suffix"]', data.veteranFullName.suffix)
      .click('input[name="root_view:veteranId_view:noSSN"]')
      .setValue('input[name="root_view:veteranId_vaFileNumber"]', data.vaFileNumber);
  }
}

function completeRelativeInformation(client, data, onlyRequiredFields) {
  const dobFields = data.relativeDateOfBirth.split('-');
  client
    .clearValue('input[name="root_relativeFullName_first"]')
    .setValue('input[name="root_relativeFullName_first"]', data.relativeFullName.first)
    .clearValue('input[name="root_relativeFullName_last"]')
    .setValue('input[name="root_relativeFullName_last"]', data.relativeFullName.last)
    .clearValue('input[name="root_relativeSocialSecurityNumber"]')
    .setValue('input[name="root_relativeSocialSecurityNumber"]', data.relativeSocialSecurityNumber)
    .clearValue('input[name="root_relativeDateOfBirthYear"]')
    .setValue('input[name="root_relativeDateOfBirthYear"]', parseInt(dobFields[0], 10).toString())
    .click('input[name="root_relationship_1"]');
  selectDropdown(client, 'root_relativeDateOfBirthMonth', parseInt(dobFields[1], 10).toString());
  selectDropdown(client, 'root_relativeDateOfBirthDay', parseInt(dobFields[2], 10).toString());

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="root_relativeFullName_middle"]', data.relativeFullName.middle)
      .click(data.gender === 'M' ? 'input[name=root_gender_0' : 'input[name=root_gender_1');
    selectDropdown(client, 'root_relativeFullName_suffix', data.relativeFullName.suffix);
  }
}

function completeAdditionalBenefits(client, data) {
  if (typeof data.nonVaAssistance !== 'undefined') {
    client.click(data.nonVaAssistance ? 'input[name="root_nonVaAssistanceYes"]' : 'input[name="root_nonVaAssistanceNo"]');
  }
  if (typeof data.civilianBenefitsAssistance !== 'undefined') {
    client.click(data.civilianBenefitsAssistance ? 'input[name="root_civilianBenefitsAssistanceYes"]' : 'input[name="root_civilianBenefitsAssistanceNo"]');
  }
  // TODO for 5490: set value for data.civilianBenefitsSource
}

function completeBenefitsSelection(client) {
  // Some but not all edu forms require a benefit to be selected, so always select one
  client
    .click('.form-radio-buttons:first-child input');
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

function completeVeteranAddress(client, data) {
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
    .setValue('input[name="root_veteranAddress_postalCode"]', data.veteranAddress.postalCode);
}

// TODO: add parameter to fill either veteran or relative address
function completeContactInformation(client, data, onlyRequiredFields) {
  completeVeteranAddress(client, data);
  client
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

function completeDirectDeposit(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="root_bankAccountChange_1"]')
      .setValue('input[name="root_bankAccount_accountNumber"]', data.bankAccount.accountNumber)
      .setValue('input[name="root_bankAccount_routingNumber"]', data.bankAccount.routingNumber);
  }
}

module.exports = {
  initApplicationSubmitMock,
  completeVeteranInformation,
  completeRelativeInformation,
  completeAdditionalBenefits,
  completeBenefitsSelection,
  completeServicePeriods,
  completeVeteranAddress,
  completeContactInformation,
  completeDirectDeposit
};
