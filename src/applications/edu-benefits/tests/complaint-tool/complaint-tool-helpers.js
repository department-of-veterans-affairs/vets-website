const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeApplicantInformation(client) {
  client
    .click('input[name="root_onBehalfOf_0"]')
    .fillName('root_fullName_first', 'Lebron')
    .fillName('root_fullName_last', 'James')
    .waitForElementVisible('select[name="root_serviceAffiliation"]', Timeouts.slow)
    .fill('select[name="root_serviceAffiliation"]', 'Veteran');
}

function completeContactInformation(client) {
  client
    .click('input[name="root_onBehalfOf_0"]')
    .fillName('root_fullName_first', 'Lebron')
    .fillName('root_fullName_last', 'James')
    .waitForElementVisible('select[name="root_serviceAffiliation"]', Timeouts.slow)
    .fill('select[name="root_serviceAffiliation"]', 'Veteran');
}

module.exports = {
  completeApplicantInformation,
  completeContactInformation
};
