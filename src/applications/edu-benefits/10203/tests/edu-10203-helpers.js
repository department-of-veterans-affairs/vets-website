const Timeouts = require('platform/testing/e2e/timeouts.js');
const EduHelpers = require('../../tests/1990/edu-helpers');

function completeStemSelection(client) {
  client.waitForElementVisible(
    'label[for="root_isEdithNourseRogersScholarshipYes"',
    Timeouts.slow,
  );
  client.click('input[id="root_isEdithNourseRogersScholarshipYes"]');
  client.click('input[id="root_isEnrolledStemYes"]');
  client.click('input[id="root_view:exhaustionOfBenefitsYes"]');
}
function completeActiveDuty(client) {
  client.waitForElementVisible(
    'label[for="root_isActiveDutyYes"]',
    Timeouts.slow,
  );
  client.click('input[id="root_isActiveDutyYes"]');
}

function completeContactInformation(client, data, isRelative = false) {
  client.waitForElementVisible(
    'label[for="root_veteranAddress_country"]',
    Timeouts.slow,
  );
  if (isRelative) {
    EduHelpers.completeRelativeAddress(client, data);
  } else {
    EduHelpers.completeVeteranAddress(client, data);
  }
  client
    .clearValue('input[name="root_view:otherContactInfo_email"]')
    .setValue(
      'input[name="root_view:otherContactInfo_email"]',
      data['view:otherContactInfo'].email,
    )
    .clearValue('input[name="root_view:otherContactInfo_view:confirmEmail"]')
    .setValue(
      'input[name="root_view:otherContactInfo_view:confirmEmail"]',
      data['view:otherContactInfo']['view:confirmEmail'],
    );

  client
    .click('input#root_preferredContactMethod_email')
    .clearValue('input[name="root_view:otherContactInfo_homePhone"]')
    .setValue(
      'input[name="root_view:otherContactInfo_homePhone"]',
      data['view:otherContactInfo'].homePhone,
    )
    .clearValue('input[name="root_view:otherContactInfo_mobilePhone"]')
    .setValue(
      'input[name="root_view:otherContactInfo_mobilePhone"]',
      data['view:otherContactInfo'].mobilePhone,
    );
}

const completeDirectDeposit = (client, data) => {
  client.waitForElementVisible(
    'img[src="/img/direct-deposit-check-guide.png"]',
    Timeouts.slow,
  );
  client
    .click('input#root_bankAccount_accountType_1')
    .setValue(
      'input[name="root_bankAccount_accountNumber"]',
      data.bankAccount.accountNumber,
    )
    .setValue(
      'input[name="root_bankAccount_routingNumber"]',
      data.bankAccount.routingNumber,
    );
};

const completeBenefitsSelection = (client, data) => {
  client.waitForElementVisible('label[for="root_benefit_0"]', Timeouts.slow);
  if (data.benefit) {
    client.click(`input[value="${data.benefit}"]`);
  } else if (typeof data.payHighestRateBenefit !== 'undefined') {
    // Defaults to true, so only click if we need to make it false
    client.clickIf(
      'input[name="root_payHighestRateBenefit"]',
      !data.payHighestRateBenefit,
    );
  } else {
    client.click('.form-radio-buttons:first-child input');
  }
};

const completeApplicantInformation = (client, data, prefix = 'relative') => {
  client.waitForElementVisible(
    'input[name="root_veteranFullName_first"]',
    Timeouts.slow,
  );
  const fullName = data[`${prefix}FullName`];
  if (fullName) {
    client
      .fill(`input[name="root_${prefix}FullName_first"]`, fullName.first)
      .setValue(`input[name="root_${prefix}FullName_middle"]`, fullName.middle)
      .fill(`input[name="root_${prefix}FullName_last"]`, fullName.last)
      .selectDropdown(`root_${prefix}FullName_suffix`, fullName.suffix);
  }

  const ssn = data[`${prefix}SocialSecurityNumber`];
  if (ssn) {
    client.fill(`input[name="root_${prefix}SocialSecurityNumber"]`, ssn);
  }
  if (data.relativeVaFileNumber) {
    client
      .fillCheckbox('input[name="root_view:noSSN"]')
      .fill(
        'input[name="root_relativeVaFileNumber"]',
        data.relativeVaFileNumber,
      );
  } else if (data.vaFileNumber) {
    client
      .fillCheckbox('input[name="root_view:noSSN"]')
      .fill('input[name="root_vaFileNumber"]', data.vaFileNumber);
  }

  const dob = data[`${prefix}DateOfBirth`];
  if (dob) {
    client.fillDate(`root_${prefix}DateOfBirth`, dob);
  }

  if (typeof data.relationship !== 'undefined') {
    client.click('input#root_relationship_0');
  }

  if (data.gender) {
    client.click(
      data.gender === 'M' ? 'input#root_gender_0' : 'input#root_gender_1',
    );
  }
};

module.exports = {
  completeStemSelection,
  completeActiveDuty,
  completeContactInformation,
  completeDirectDeposit,
  completeBenefitsSelection,
  completeApplicantInformation,
};
