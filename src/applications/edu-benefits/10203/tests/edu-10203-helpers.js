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
module.exports = {
  completeStemSelection,
  completeActiveDuty,
  completeContactInformation,
};
