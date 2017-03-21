const mock = require('./mock-helpers');

// Create API routes
function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/education_benefits_claims/1990e',
    verb: 'post',
    value: {
      data: {
        attributes: {
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16',
          regionalOffice: 'Test'
        }
      }
    }
  });
}

function completeRelativeInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="root_relativeFullName_first"]')
    .setValue('input[name="root_relativeFullName_first"]', data.relativeFullName.first)
    .clearValue('input[name="root_relativeFullName_last"]')
    .setValue('input[name="root_relativeFullName_last"]', data.relativeFullName.last)
    .clearValue('input[name="root_relativeSocialSecurityNumber"]')
    .setValue('input[name="root_relativeSocialSecurityNumber"]', data.relativeSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="root_relativeFullName_middle"]', data.relativeFullName.middle)
      .setValue('select[name="root_relativeFullName_suffix"]', data.relativeFullName.suffix);
  }
}

module.exports = {
  initApplicationSubmitMock,
  completeRelativeInformation
};
