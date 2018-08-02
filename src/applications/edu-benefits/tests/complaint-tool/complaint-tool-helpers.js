const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeApplicantInformation(client, data) {
  client
    // .waitForElementVisible('root_onBehalfOf', Timeouts.normal)
    // .axeCheck('.main')
    .selectRadio('input#root_onBehalfOf', data.onBehalfOf)
    // .fillName('root_FullName', data.applicantFullName);
    // .waitForElementVisible('input[name="root_serviceAffiliation"]', Timeouts.slow);
}

function completeBenefitsInformation(client, data) {
  client
    .click('label [for="root_programs_Post-9/11 Ch 33"]');
}

module.exports = {
  // completeApplicantInformation
  completeBenefitsInformation
};
