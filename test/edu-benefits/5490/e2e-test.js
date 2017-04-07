const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
const Edu5490Helpers = require('../../e2e/edu-5490-helpers');
const testData = require('./schema/maximal-test.json');


module.exports = (client, onlyRequiredFields) => {
  EduHelpers.initApplicationSubmitMock('5490');

  // Ensure introduction page renders
  client
    .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/5490`)
    .waitForElementVisible('body', Timeouts.normal)
    .assert.title('Apply for education benefits: Vets.gov')
    .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
    .click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.overrideVetsGovApi(client);
  E2eHelpers.overrideSmoothScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // Applicant information page
  client
    .waitForElementVisible('input[name="root_relativeFullName_first"]', Timeouts.slow);
  EduHelpers.completeRelativeInformation(client, {
    relationship: testData.sponsorInformation.data.relationship,
    ...testData.applicantInformation.data
  }, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/applicant/information');

  // Additional benefits page
  client
    .waitForElementVisible('label[for="root_civilianBenefitsAssistance"]', Timeouts.slow);
  EduHelpers.completeAdditionalBenefits(client, testData.additionalBenefits.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/applicant/additional-benefits');

  // Applicant service page
  client
    .waitForElementVisible('label[for="root_view:applicantServedYes"]', Timeouts.slow);
  EduHelpers.completeServicePeriods(client, testData.applicantService.data, onlyRequiredFields, 'view:applicantServed');
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/applicant/service');

  // Benefit selection page
  client
    .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
  Edu5490Helpers.completeBenefitSelection(client, testData.benefitSelection.data, onlyRequiredFields);
  // It's like this isn't getting clicked...when I click it in Electron after
  //  it's hung up, I get to the next page. I wonder if it has to do with the
  //  expanding animation...? At any rate, waiting for the expanded element to
  //  be visible seems to make it work.
  client
    .waitForElementVisible('div.schemaform-radio-indent', Timeouts.normal)
    .click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

  // Benefit relinquishment page
  // This page will only be accessed if relationship is a child
  if (testData.sponsorInformation.relationship === 'child') {
    client
      .waitForElementVisible('label[for="root_benefitsRelinquishedDateMonth"]', Timeouts.slow);
    Edu5490Helpers.completeBenefitRelinquishment(client, testData.benefitRelinquishment.data);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits/relinquishment');
  }

  // Benefit history page
  client
    .waitForElementVisible('label[for="root_previousBenefits_disability"]', Timeouts.slow);
  Edu5490Helpers.completeBenefitHistory(client, testData.benefitHistory.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/benefits/history');

  // Sponsor information page
  client
    .waitForElementVisible('input[name="root_view:currentSponsorInformation_veteranFullName_first"]', Timeouts.slow);
  // Alternatively, we can write a whole new function for this if this is going to
  //  be very specific to the 5490
  EduHelpers.completeVeteranInformation(client,
    Object.assign({},
      testData.sponsorInformation.data,
      testData.sponsorInformation.data['view:currentSponsorInformation']
    ),
    onlyRequiredFields,
    'root_view:currentSponsorInformation'
  );
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/veteran/information');

  // Sponsor service page
  client
    .waitForElementVisible('input[name="root_serviceBranch"]', Timeouts.slow);
  Edu5490Helpers.completeSponsorService(client, testData.sponsorService.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/sponsor/service');

  // Education history page
  client
    .waitForElementVisible('select[name="root_highSchool_status"]', Timeouts.slow);
  Edu5490Helpers.completeEducationHistory(client, testData.educationHistory.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/education/history');

  // Employment history page
  client
    .waitForElementVisible('label[for="root_view:hasNonMilitaryJobs"]', Timeouts.slow);
  Edu5490Helpers.completeEmploymentHistory(client, testData.employmentHistory.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/employment/history');

  // School selection page
  client
    .waitForElementVisible('input[name="root_educationProgram_name"]', Timeouts.slow);
  EduHelpers.completeSchoolSelection(client, testData.schoolSelection.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/school-selection');

  // Contact information page
  client
    .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
  EduHelpers.completeContactInformation(client, testData.contactInformation.data, onlyRequiredFields, true);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

  // Secondary contact page
  client
    .waitForElementVisible('label[for="root_secondaryContact_fullName"]', Timeouts.slow);
  Edu5490Helpers.completeSecondaryContact(client, testData.secondaryContact.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

  // Direct deposit page
  client
    .waitForElementVisible('label[for="root_bankAccount_accountType"]', Timeouts.slow);
  EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, onlyRequiredFields);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

  // Review and submit page
  client
    .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow);
  client
    .pause(1000)
    .click('input[type="checkbox"]')
    .click('.form-progress-buttons .usa-button-primary');
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain('/review-and-submit').before(Timeouts.submission);

  // Confirmation page
  client
    .expect.element('.edu-benefits-submit-success').to.be.visible;

  client.end();
};
