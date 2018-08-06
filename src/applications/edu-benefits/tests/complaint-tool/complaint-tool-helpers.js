const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeApplicantInformation(client, data) {
  client
    // HACK: Shouldn't need to wait twice
    .waitForElementVisible('label[for="root_onBehalfOf_0"]', Timeouts.normal)
    // This is failing randomly?
    .selectRadio('root_onBehalfOf', data.onBehalfOf)
    // .click('label[for="root_onBehalfOf_0"]')
    .waitForElementVisible('#root_fullName_first', Timeouts.slow)
    .fillName('root_fullName', data.applicantFullName)
    .waitForElementVisible('#root_serviceAffiliation', Timeouts.normal)
    .selectDropdown('root_serviceAffiliation', data.serviceAffiliation);
}

function completeContactInformation(client, data) {
  client
    .waitForElementVisible('#root_address_street', Timeouts.normal)
    .fill('#root_address_street', data.street)
    .fill('#root_address_city', data.city)
    .waitForElementVisible('#root_address_state', Timeouts.normal)
    // Not working
    .selectDropdown('root_address_state', 'Georgia')
    .fill('#root_address_postalCode', data.postalCode)
    .fill('#root_applicantEmail', data.applicantEmail)
    // Not Working
    // .waitForElementVisible('#root_view:applicantEmailConfirmation', Timeouts.normal)
    // .fill('#root_view:applicantEmailConfirmation', data.applicantEmailConfirmation)
    .pause(2000);
}

// function completeBenefitsInformation(client, data) {
//   client
//     .click('label [for="root_programs_Post-9/11 Ch 33"]');
// }

module.exports = {
  completeApplicantInformation,
  completeContactInformation
  // completeBenefitsInformation
};
