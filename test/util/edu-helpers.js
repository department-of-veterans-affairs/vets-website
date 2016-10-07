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
    month: 'May',
    day: '2',
    year: '1984'
  },
  gender: 'F',
  toursOfDuty: [
    {
      serviceBranch: 'Air Force',
      fromDate: {
        month: 'May',
        day: '2',
        year: '1996'
      },
      toDate: {
        month: 'May',
        day: '2',
        year: '1999'
      },
      serviceStatus: 'Drilling',
      involuntarilyCalledToDuty: 'Y',
      doNotApplyPeriodToSelected: true
    }
  ],
  veteranAddress: {
    country: 'USA',
    street: '123 vet st',
    city: 'The VA',
    state: 'DC',
    postalCode: '12345'
  },
  email: 'test@test.com',
  phone: '555555566'
};
/* eslint-enable */

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/education_benefits_claims',
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
    }
  });
}

function completeVeteranInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="fname"]')
    .setValue('input[name="fname"]', data.veteranFullName.first)
    .clearValue('input[name="lname"]')
    .setValue('input[name="lname"]', data.veteranFullName.last)
    .clearValue('select[name="veteranBirthMonth"]')
    .setValue('select[name="veteranBirthMonth"]', data.veteranDateOfBirth.month)
    .clearValue('select[name="veteranBirthDay"]')
    .setValue('select[name="veteranBirthDay"]', data.veteranDateOfBirth.day)
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

function completeMilitaryService(client, data, onlyRequiredFields) {
  client
    .clearValue('select[name="serviceBranch"]')
    .setValue('select[name="serviceBranch"]', data.toursOfDuty[0].serviceBranch)
    .clearValue('select[name="fromDateMonth"]')
    .setValue('select[name="fromDateMonth"]', data.toursOfDuty[0].fromDate.month)
    .clearValue('select[name="fromDateDay"]')
    .setValue('select[name="fromDateDay"]', data.toursOfDuty[0].fromDate.day)
    .clearValue('input[name="fromDateYear"]')
    .setValue('input[name="fromDateYear"]', data.toursOfDuty[0].fromDate.year)
    .clearValue('select[name="toDateMonth"]')
    .setValue('select[name="toDateMonth"]', data.toursOfDuty[0].toDate.month)
    .clearValue('select[name="toDateDay"]')
    .setValue('select[name="toDateDay"]', data.toursOfDuty[0].toDate.day)
    .clearValue('input[name="toDateYear"]')
    .setValue('input[name="toDateYear"]', data.toursOfDuty[0].toDate.year);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="serviceStatus"]', data.toursOfDuty[0].serviceStatus);
  }
}

function completeContactInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="address"]')
    .setValue('input[name="address"]', data.veteranAddress.street)
    .clearValue('input[name="city"]')
    .setValue('input[name="city"]', data.veteranAddress.city)
    .clearValue('select[name="state"]')
    .setValue('select[name="state"]', data.veteranAddress.state)
    .clearValue('input[name="postalCode"]')
    .setValue('input[name="postalCode"]', data.veteranAddress.postalCode)
    .clearValue('input[name="email"]')
    .setValue('input[name="email"]', data.email)
    .clearValue('input[name="emailConfirmation"]')
    .setValue('input[name="emailConfirmation"]', data.email);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="phone"]', data.phone);
  }
}

module.exports = {
  testValues,
  initApplicationSubmitMock,
  completeVeteranInformation,
  completeMilitaryService,
  completeContactInformation
};
