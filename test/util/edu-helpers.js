const request = require('request');
const E2eHelpers = require('./e2e-helpers');

// Disable eslint for JSON
/* eslint-disable */
//TODO: add example api response
const testValues = {
  veteranFullName: {
    first: 'Jane',
    last: 'Smith',
    middle: 'Alice',
    suffix: 'Jr.'
  },
  veteranSocialSecurityNumber: '123456677',
  veteranDateOfBirth: {
    month: '5',
    day: '2',
    year: '1984'
  },
  gender: 'F'
};
/* eslint-enable */

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/api/v0/education_benefits_claims',
      verb: 'post',
      value: testValues
    }
  });
}

function completeVeteranInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="fname"]')
    .setValue('input[name="fname"]', data.veteranFullName.first)
    .clearValue('input[name="lname"]')
    .setValue('input[name="lname"]', data.veteranFullName.last)
    .clearValue('input[name="veteranBirthMonth"]')
    .setValue('input[name="veteranBirthMonth"]', data.veteranDateOfBirth.month)
    .clearValue('input[name="veteranBirthDay"]')
    .setValue('input[name="veteranBirthDay"]', data.veteranDateOfBirth.day)
    .clearValue('input[name="veteranBirthYear"]')
    .setValue('input[name="veteranBirthYear"]', data.veteranDateOfBirth.year)
    .clearValue('input[name="ssn"]')
    .setValue('input[name="ssn"]', data.veteranSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="mname"]', data.veteranFullName.middle)
      .setValue('select[name="suffix"]', data.veteranFullName.suffix)
      .setValue('input[name="gender"]', data.gender);
  }
}

module.exports = {
  testValues,
  initApplicationSubmitMock,
  completeVeteranInformation
};
