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
    cy.url().should('not.contain', '/applicant-military-name');

    // Benefit Selection Page
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.veteran.desiredCemetery,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents Page
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Veteran Contact Information Page
    preneedHelpers.validateProgressBar('5');

    // Preparer Contact Information Page
    preneedHelpers.validateProgressBar('5');

    // Review/Submit Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.submitForm();
  });
});
