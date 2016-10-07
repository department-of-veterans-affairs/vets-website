const request = require('request');
const E2eHelpers = require('./e2e-helpers');
const Timeouts = require('../util/timeouts.js');

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
  phone: '555555566',
  benefitsRelinquishedDate: {
    month: '2',
    day: '2',
    year: (new Date()).getFullYear()
  },
  serviceAcademyGraduationYear: '1999',
  commissionYear: 2007,
  rotcScholarships: [
    {
      year: '2004',
      amount: '5000'
    }
  ],
  activeDutyRange: {
    from: {
      month: 'May',
      day: '2',
      year: '1996'
    },
    to: {
      month: 'May',
      day: '2',
      year: '1999'
    }
  },
  highSchoolOrGedCompletionDate: {
    month: 'May',
    day: '2',
    year: '1996'
  },
  educationPeriods: [
    {
      college: 'College of Things',
      city: 'New York',
      state: 'NY',
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
      hours: '9',
      degreeReceived: 'Fancy degree',
      major: 'A major'
    }
  ],
  faaFlightCertificatesInformation: 'Blah Blah Blah'
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
      .click('input[name="gender-0"]');
  }
}

function completeBenefitsSelection(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="chapter33"]')
      .click('input[name="benefitsRelinquished-1"]')
      .waitForElementVisible('select[name="benefitsRelinquishedDateMonth"]', Timeouts.slow)
      .clearValue('select[name="benefitsRelinquishedDateMonth"]')
      .setValue('select[name="benefitsRelinquishedDateMonth"]', data.benefitsRelinquishedDate.month)
      .clearValue('select[name="benefitsRelinquishedDateDay"]')
      .setValue('select[name="benefitsRelinquishedDateDay"]', data.benefitsRelinquishedDate.day)
      .setValue('input[name="benefitsRelinquishedDateYear"]', data.benefitsRelinquishedDate.year)
      .click('input[name="chapter30"]')
      .click('input[name="chapter1606"]')
      .click('input[name="chapter32"]');
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
      .setValue('input[name="serviceStatus"]', data.toursOfDuty[0].serviceStatus)
      .setValue('input[name="serviceAcademyGraduationYear"]', data.serviceAcademyGraduationYear)
      .click('input[name="currentlyActiveDuty-0"]')
      .click('input[name="onTerminalLeave-0"]')
      .click('input[name="nonVaAssistance-1"]')
      .click('input[name="doNotApplyPeriodToSelected"]')
      .click('input[name="benefitsToApplyTo-1"]');
  }
}

function completeRotcHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="seniorRotcCommissioned-0"]')
      .setValue('input[name="commissionYear"]', data.commissionYear)
      .setValue('input[name="year"]', data.rotcScholarships[0].year)
      .setValue('input[name="amount"]', data.rotcScholarships[0].amount)
      .click('input[name="RotcTuition-0"]');
  }
}

function completeBenefitsHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="civilianBenefitsAssistance"]')
      .click('input[name="additionalContributions"]')
      .click('input[name="activeDutyKicker"]')
      .click('input[name="reserveKicker"]')
      .click('input[name="activeDutyRepaying-0"]')
      .clearValue('select[name="fromMonth"]')
      .setValue('select[name="fromMonth"]', data.activeDutyRange.from.month)
      .clearValue('select[name="fromDay"]')
      .setValue('select[name="fromDay"]', data.activeDutyRange.from.day)
      .clearValue('input[name="fromYear"]')
      .setValue('input[name="fromYear"]', data.activeDutyRange.from.year)
      .clearValue('select[name="toMonth"]')
      .setValue('select[name="toMonth"]', data.activeDutyRange.to.month)
      .clearValue('select[name="toDay"]')
      .setValue('select[name="toDay"]', data.activeDutyRange.to.day)
      .clearValue('input[name="toYear"]')
      .setValue('input[name="toYear"]', data.activeDutyRange.to.year);
  }
}

function completeEducationHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .clearValue('select[name="highSchoolOrGedCompletionDateMonth"]')
      .setValue('select[name="highSchoolOrGedCompletionDateMonth"]', data.highSchoolOrGedCompletionDate.month)
      .clearValue('select[name="highSchoolOrGedCompletionDateDay"]')
      .setValue('select[name="highSchoolOrGedCompletionDateDay"]', data.highSchoolOrGedCompletionDate.day)
      .clearValue('input[name="highSchoolOrGedCompletionDateYear"]')
      .setValue('input[name="highSchoolOrGedCompletionDateYear"]', data.highSchoolOrGedCompletionDate.year)
      .clearValue('input[name="name"]')
      .setValue('input[name="name"]', data.educationPeriods[0].college)
      .clearValue('input[name="city"]')
      .setValue('input[name="city"]', data.educationPeriods[0].city)
      .clearValue('select[name="state"]')
      .setValue('select[name="state"]', data.educationPeriods[0].state)
      .clearValue('select[name="fromDateMonth"]')
      .setValue('select[name="fromDateMonth"]', data.educationPeriods[0].fromDate.month)
      .clearValue('select[name="fromDateDay"]')
      .setValue('select[name="fromDateDay"]', data.educationPeriods[0].fromDate.day)
      .clearValue('input[name="fromDateYear"]')
      .setValue('input[name="fromDateYear"]', data.educationPeriods[0].fromDate.year)
      .clearValue('select[name="toDateMonth"]')
      .setValue('select[name="toDateMonth"]', data.educationPeriods[0].toDate.month)
      .clearValue('select[name="toDateDay"]')
      .setValue('select[name="toDateDay"]', data.educationPeriods[0].toDate.day)
      .clearValue('input[name="toDateYear"]')
      .setValue('input[name="toDateYear"]', data.educationPeriods[0].toDate.year)
      .clearValue('input[name="hours"]')
      .setValue('input[name="hours"]', data.educationPeriods[0].hours)
      .click('input[name="hoursType-0"]')
      .clearValue('input[name="degreeReceived"]')
      .setValue('input[name="degreeReceived"]', data.educationPeriods[0].degreeReceived)
      .clearValue('input[name="major"]')
      .setValue('input[name="major"]', data.educationPeriods[0].major)
      .clearValue('input[name="faaFlightCertificatesInformation"]')
      .setValue('input[name="faaFlightCertificatesInformation"]', data.faaFlightCertificatesInformation);
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
  completeContactInformation,
  completeBenefitsSelection,
  completeRotcHistory,
  completeBenefitsHistory,
  completeEducationHistory
};
