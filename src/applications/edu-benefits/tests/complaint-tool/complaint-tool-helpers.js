const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeApplicantInformation(client, data) {
  client
    // .waitForElementVisible('root_onBehalfOf', Timeouts.normal)
    // .axeCheck('.main')
    .pause(2000)
    .selectRadio('root_onBehalfOf', data.onBehalfOf)
    // .pause(2000)
    // .fill('root_fullName_first', 'data.applicantFullName.first');
    // .fillName('root_FullName', 'data.applicantFullName');
    // .waitForElementVisible('input[name="root_serviceAffiliation"]', Timeouts.slow);
}

// function completeBenefitsInformation(client, data) {
//   client
//     .click('label [for="root_programs_Post-9/11 Ch 33"]');
// }

module.exports = {
  completeApplicantInformation
  // completeBenefitsInformation
};
