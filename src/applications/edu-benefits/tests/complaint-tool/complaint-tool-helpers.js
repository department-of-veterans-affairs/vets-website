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
    // .waitForElementVisible('#root_address_street', Timeouts.normal)
    .fill('#root_address_street', data.street)
    .fill('#root_address_city', data.city)
    .waitForElementVisible('#root_address_state', Timeouts.normal)
    .selectDropdown('root_address_state', data.state)
    .fill('#root_address_postalCode', data.postalCode)
    .fill('#root_applicantEmail', data.applicantEmail)
    // Note: I don't know why this worked...
    .fill('[id="root_view:applicantEmailConfirmation"]', data.applicantEmailConfirmation);
}

function completeBenefitsInformation(client) {
  client
    // .waitForElementVisible('label [for="root_programs_Post-9/11 Ch 33"]', Timeouts.normal)
    .fillCheckbox('#root_programs_TATU');
  // Note: I don't think this likes spaces...
  // .fillCheckbox('#root_programs_Post-9/11 Ch 33');
}

function completeSchoolInformation(client) {
  client
    // .waitForElementVisible('label [for="root_programs_Post-9/11 Ch 33"]', Timeouts.normal)
    .fill('.search-input input', 'Brandeis')
    .click('.search-schools-button')
    .pause(4000)
    .waitForElementVisible('.radio-button', Timeouts.normal)
    .selectRadio('page-1-0', 31003921);
}

function completeFeedbackInformation(client, data) {
  client
    // .waitForElementVisible('label [for="#root_issue_accreditation"]', Timeouts.normal)
    .fillCheckbox('#root_issue_accreditation')
    .fill('#root_issueDescription', data.issueDescription)
    .fill('#root_issueResolution', data.issueResolution);
}

module.exports = {
  completeApplicantInformation,
  completeContactInformation,
  completeBenefitsInformation,
  completeSchoolInformation,
  completeFeedbackInformation
};
