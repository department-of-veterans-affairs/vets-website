const mock = require('./mock-helpers');

function completeApplicantInformation(client, data) {
  client
    .fillName('root_veteranFullName', data.veteranFullName)
    .fill('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber)
    .fill('input[name="root_vaFileNumber"]', data.vaFileNumber)
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/pension_claims',
    verb: 'post',
    value: {
      data: {
        attributes: {
          regionalOffice: [],
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16'
        }
      }
    }
  });
}

module.exports = {
  completeApplicantInformation,
  initApplicationSubmitMock
};
