const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');

function completeClaimantInformation(client, data) {
  client
    .fillName('root_claimantFullName', data.claimantFullName)
    .click('input[name="root_view:noSSN"]')
    .waitForElementVisible('input[name="root_vaFileNumber"]', Timeouts.slow)
    .fill('input[name="root_vaFileNumber"]', data.vaFileNumber);
}

module.exports = {
  completeClaimantInformation
};
