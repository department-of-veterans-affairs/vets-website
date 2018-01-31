const mock = require('./mock-helpers');

function completeApplicantInformation(client, data) {
  client
    .fillName('root_veteranFullName', data.veteranFullName)
    .selectRadio('root_gender', data.gender)
    .fill('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber)
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth)
    .selectDropdown('root_serviceBranch', data.serviceBranch);
}

function completeAddressInformation(client, data) {
  client
    .fillAddress('root_veteranAddress', data.veteranAddress);
}

function completeContactInformation(client, data) {
  client
    .fill('input[name$="email"]', data.email)
    .fill('input[name$="confirmEmail"]', data.email)
    .fill('input[name$="phone"]', data.phone);
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/vic',
    verb: 'post',
    value: {
      data: {
        attributes: {
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16'
        }
      }
    }
  });
}

function initDocumentUploadMock() {
  mock(null, {
    path: '/v0/vic/vic_attachments',
    verb: 'post',
    value: {
      data: {
        attributes: {
          attachmentId: '1',
          name: 'VA40-10007.pdf',
          confirmationCode: 'e2128ec4-b2fc-429c-bad2-e4b564a80d20',
        }
      }
    }
  });
}

module.exports = {
  initApplicationSubmitMock,
  initDocumentUploadMock,
  completeAddressInformation,
  completeApplicantInformation,
  completeContactInformation
};
