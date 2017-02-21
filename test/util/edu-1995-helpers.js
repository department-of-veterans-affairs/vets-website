const Timeouts = require('../util/timeouts.js');
const mock = require('./mock-helpers');
const testData = requuire('../edu-benefits/1995/schema/maximal-test.json');

// Create API routes
function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/education_benefits_claims/1995',
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

function completeVeteranInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="root_veteranFullName_first"]')
    .setValue('input[name="root_veteranFullName_first"]', data.veteranFullName.first)
    .clearValue('input[name="root_veteranFullName_last"]')
    .setValue('input[name="root_veteranFullName_last"]', data.veteranFullName.last)
    .clearValue('input[name="veteranSocialSecurityNumber"]')
    .setValue('input[name="veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="root_veteranFullName_middle"]', data.veteranFullName.middle)
      .setValue('select[name="root_veteranFullName_suffix"]', data.veteranFullName.suffix);
  }
}

function completeBenefitsSelection(client, data, onlyRequiredFields) {
  client
    .click('label[name="chapter30-label"]');

  if (!onlyRequiredFields) {
    client
      .click('label[name="chapter33-label"]')
      .click('label[name="chapter1606-label"]')
      .click('label[name="chapter32-label"]');
  }
}

function completeBenefitsRelinquishment(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['input[name="benefitsRelinquished-1"]']);
    client
      .pause(1000)
      .waitForElementVisible('select[name="benefitsRelinquishedDateMonth"]', Timeouts.slow)
      .clearValue('select[name="benefitsRelinquishedDateMonth"]')
      .setValue('select[name="benefitsRelinquishedDateMonth"]', data.benefitsRelinquishedDate.month)
      .clearValue('select[name="benefitsRelinquishedDateDay"]')
      .setValue('select[name="benefitsRelinquishedDateDay"]', data.benefitsRelinquishedDate.day)
      .clearValue('input[name="benefitsRelinquishedDateYear"]')
      .setValue('input[name="benefitsRelinquishedDateYear"]', data.benefitsRelinquishedDate.year);
  }
}

function completeServicePeriods(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="serviceBranch"]')
    .setValue('input[name="serviceBranch"]', data.toursOfDuty[0].serviceBranch)
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
      .click('input[name="applyPeriodToSelected"]')
      .setValue('textarea[name="benefitsToApplyTo"]', data.toursOfDuty[0].benefitsToApplyTo);
  }
}

function completeMilitaryService(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .setValue('input[name="serviceAcademyGraduationYear"]', data.serviceAcademyGraduationYear)
      .click('input[name="currentlyActiveDuty-0"]')
      .click('input[name="onTerminalLeave-0"]');
  }
}

function completeRotcHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['input[name="seniorRotcCommissioned-0"]']);

    client
      .pause(1000)
      .setValue('input[name="commissionYear"]', data.commissionYear)
      .setValue('input[name="year"]', data.rotcScholarships[0].year)
      .setValue('input[name="amount"]', data.rotcScholarships[0].amount);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="RotcTuition-0-label"]']);
  }
}

function completeContributions(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="civilianBenefitsAssistance-label"]']);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="additionalContributions-label"]']);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="activeDutyKicker-label"]']);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="reserveKicker-label"]']);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="activeDutyRepaying-label"]']);

    client
      .pause(1000)
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
      .clearValue('input[name="fromDateYear"]')
      .setValue('input[name="fromDateYear"]', data.educationPeriods[0].fromDate.year)
      .clearValue('select[name="toDateMonth"]')
      .setValue('select[name="toDateMonth"]', data.educationPeriods[0].toDate.month)
      .clearValue('input[name="toDateYear"]')
      .setValue('input[name="toDateYear"]', data.educationPeriods[0].toDate.year)
      .clearValue('input[name="hours"]')
      .setValue('input[name="hours"]', data.educationPeriods[0].hours)
      .click('input[name="hoursType-0"]')
      .clearValue('input[name="degreeReceived"]')
      .setValue('input[name="degreeReceived"]', data.educationPeriods[0].degreeReceived)
      .clearValue('input[name="major"]')
      .setValue('input[name="major"]', data.educationPeriods[0].major)
      .clearValue('textarea[name="faaFlightCertificatesInformation"]')
      .setValue('textarea[name="faaFlightCertificatesInformation"]', data.faaFlightCertificatesInformation);
  }
}

function completeEmploymentHistory(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['input[name="hasNonMilitaryJobs-0"]']);

    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['input[name="postMilitaryJob-0"]']);

    client
      .pause(1000)
      .setValue('input[name="name"]', data.employmentPeriods[0].job)
      .setValue('input[name="months"]', data.employmentPeriods[0].months)
      .setValue('input[name="licenseOrRating"]', data.employmentPeriods[0].licenseOrRating);
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
      .setValue('input[name="phone"]', data.phone)
      .setValue('input[name="mobilePhone"]', data.phone)
      .click('input[name="preferredContactMethod-0"]');
  }
}

function completeSchoolSelection(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .clearValue('select[name="educationType"]')
      .setValue('select[name="educationType"]', data.educationType)
      .clearValue('input[name="schoolName"]')
      .setValue('input[name="schoolName"]', data.schoolName)
      .clearValue('input[name="address"]')
      .setValue('input[name="address"]', data.schoolAddress.street)
      .clearValue('input[name="city"]')
      .setValue('input[name="city"]', data.schoolAddress.city)
      .clearValue('select[name="state"]')
      .setValue('select[name="state"]', data.schoolAddress.state)
      .clearValue('input[name="postalCode"]')
      .setValue('input[name="postalCode"]', data.schoolAddress.postalCode)
      .setValue('input[name="educationObjective"]', data.educationObjective)
      .clearValue('select[name="educationStartDateMonth"]')
      .setValue('select[name="educationStartDateMonth"]', data.educationStartDate.month)
      .clearValue('select[name="educationStartDateDay"]')
      .setValue('select[name="educationStartDateDay"]', data.educationStartDate.day)
      .clearValue('input[name="educationStartDateYear"]')
      .setValue('input[name="educationStartDateYear"]', data.educationStartDate.year);
  }
}

function completeSecondaryContact(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .setValue('input[name="secondaryContactName"]', data.secondaryContactName)
      .clearValue('input[name="secondaryContactPhone"]')
      .setValue('input[name="secondaryContactPhone"]', data.secondaryPhone)
      .clearValue('input[name="address"]')
      .setValue('input[name="address"]', data.secondaryAddress.street)
      .clearValue('input[name="city"]')
      .setValue('input[name="city"]', data.secondaryAddress.city)
      .clearValue('select[name="state"]')
      .setValue('select[name="state"]', data.secondaryAddress.state)
      .clearValue('input[name="postalCode"]')
      .setValue('input[name="postalCode"]', data.secondaryAddress.postalCode);
  }
}

function completeDirectDeposit(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .click('input[name="accountType-0"]')
      .setValue('input[name="accountNumber"]', data.accountNumber)
      .setValue('input[name="routingNumber"]', data.routingNumber);
  }
}

module.exports = {
  testData,
  initApplicationSubmitMock,
  completeVeteranInformation,
  completeMilitaryService,
  completeServicePeriods,
  completeContactInformation,
  completeBenefitsSelection,
  completeBenefitsRelinquishment,
  completeRotcHistory,
  completeContributions,
  completeEducationHistory,
  completeEmploymentHistory,
  completeSchoolSelection,
  completeSecondaryContact,
  completeDirectDeposit
};
