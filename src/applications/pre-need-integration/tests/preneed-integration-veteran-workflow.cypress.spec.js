/* eslint-disable @department-of-veterans-affairs/axe-check-required */
// axe checks are called in the helper file for all pages
import preneedHelpers from './utils/cypress-preneed-integration-helpers';
import testData from './fixtures/data/veteran-test.json';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;

// hard coded for now; found in veteran.race
const demographicCheckboxes = ['isWhite'];

describe('Pre-need form VA 40-10007 Veteran Workflow', () => {
  it('fills the form and navigates accordingly as a veteran', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Preparer Information
    preneedHelpers.fillPreparerInfo(applicant);

    // Applicant Information
    preneedHelpers.fillApplicantInfo(
      claimant.name,
      claimant.ssn,
      claimant.dateOfBirth,
      claimant.relationshipToVet,
      veteran.cityOfBirth,
      veteran.stateOfBirth,
    );

    // Applicant Contact Info
    preneedHelpers.fillApplicantContactInfo(
      claimant.address,
      claimant.email,
      claimant.phoneNumber,
    );

    // Applicant Demographics
    preneedHelpers.fillVeteranDemographics(veteran, demographicCheckboxes);

    // Military History Page
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillMilitaryHistory(
      veteran.militaryStatus,
      veteran.militaryServiceNumber,
      veteran.vaClaimNumber,
    );

    // Previous Names Page
    preneedHelpers.fillPreviousName(veteran);

    // Service Periods
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.fillServicePeriods(veteran.serviceRecords);

    // Benefit Selection Page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillBenefitSelection(
      claimant.desiredCemetery,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents Page
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.clickContinue();

    // Review/Submit Page
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.submitForm();
  });
});
