const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const mock = require('../../../../platform/testing/e2e/mock-helpers.js');

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/gi_bill_feedbacks',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '1234',
          submittedAt: '2016-05-16',
        },
      },
    },
  });
  mock(null, {
    path: '/v0/gi_bill_feedbacks/1234',
    verb: 'get',
    value: {
      data: {
        attributes: {
          state: 'success',
          parsedResponse: {
            caseNumber: '123fake-submission-id-567',
          },
        },
      },
    },
  });
}

function completeRelationshipInformation(client, data) {
  client.selectRadio('root_onBehalfOf', data.onBehalfOf);
  client.waitForElementVisible(
    '.usa-alert.usa-alert-info.no-background-image',
    Timeouts.slow,
  );
}

function completeApplicantInformation(client, data) {
  client
    .fillName('root_fullName', data.fullName)
    .selectDropdown('root_serviceAffiliation', data.serviceAffiliation);
}

function completeServiceInformation(client, data) {
  client
    .fillDate('root_serviceDateRange_from', data.serviceDateRange.from)
    .fillDate('root_serviceDateRange_to', data.serviceDateRange.to)
    .selectDropdown('root_serviceBranch', data.serviceBranch);
}

function completeContactInformation(client, data) {
  client
    .fillAddress('root_address', data.address)
    .fill('input[name="root_applicantEmail"]', data.applicantEmail)
    .fill(
      'input[name="root_view:applicantEmailConfirmation"]',
      data['view:applicantEmailConfirmation'],
    )
    .fill('input[name="root_phone"]', data.phone);
}

function completeBenefitInformation(client) {
  client.fillCheckbox('#root_educationDetails_programs_TATU');
}

function completeSchoolInformation(client, data) {
  client.fillCheckbox('input[type="checkbox"]');
  client.waitForElementPresent(
    'input[name="root_educationDetails_school_view:manualSchoolEntry_name"]',
    Timeouts.slow,
  );

  client
    .fill(
      'input[name="root_educationDetails_school_view:manualSchoolEntry_name"]',
      data.educationDetails.school['view:manualSchoolEntry'].name,
    )
    .fillAddress(
      'root_educationDetails_school_view:manualSchoolEntry_address',
      data.educationDetails.school['view:manualSchoolEntry'].address,
    );
}

function completeIssueInformation(client, data) {
  client
    .fillCheckbox('#root_issue_other')
    .setValue('textarea[id="root_issueDescription"]', data.issueDescription)
    .setValue('textarea[id="root_issueResolution"]', data.issueResolution);
}

module.exports = {
  completeRelationshipInformation,
  completeApplicantInformation,
  completeServiceInformation,
  completeContactInformation,
  completeBenefitInformation,
  completeSchoolInformation,
  completeIssueInformation,
  initApplicationSubmitMock,
};
