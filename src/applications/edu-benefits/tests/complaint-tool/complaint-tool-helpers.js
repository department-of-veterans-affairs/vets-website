const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeApplicantInformation(client, data) {
  client
    // HACK: Shouldn't need to wait twice
    .waitForElementVisible('label[for="root_onBehalfOf_0"]', Timeouts.normal)
    .selectRadio('root_onBehalfOf', data.onBehalfOf)
    .waitForElementVisible('#root_fullName_first', Timeouts.normal)
    .fillName('root_fullName', data.applicantFullName)
    .waitForElementVisible('#root_serviceAffiliation', Timeouts.normal)
    .selectDropdown('root_serviceAffiliation', data.serviceAffiliation);
}

// function completeContactInformation(client, data) {
//   client
//     .waitForElementVisible('#root_address_street', Timeouts.normal)
//     .fill('#root_address', data.address)
// }

// function completeBenefitsInformation(client, data) {
//   client
//     .click('label [for="root_programs_Post-9/11 Ch 33"]');
// }

module.exports = {
  completeApplicantInformation,
  // completeContactInformation
  // completeBenefitsInformation
};
