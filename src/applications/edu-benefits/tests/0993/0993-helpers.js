const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const mock = require('../../../../platform/testing/e2e/mock-helpers');

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
          regionalOffice: 'Test',
        },
      },
    },
  });
}

function completeClaimantInformation(client, data) {
  client
    .fillName('root_claimantFullName', data.claimantFullName)
    .click('input[name="root_view:noSSN"]')
    .waitForElementVisible('input[name="root_vaFileNumber"]', Timeouts.slow)
    .fill('input[name="root_vaFileNumber"]', data.vaFileNumber);
}

module.exports = {
  completeClaimantInformation,
  initApplicationSubmitMock,
};
