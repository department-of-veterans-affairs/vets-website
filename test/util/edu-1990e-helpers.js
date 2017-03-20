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

function completeRelativeInformation() {
}

module.exports = {
  initApplicationSubmitMock,
  completeRelativeInformation
};
