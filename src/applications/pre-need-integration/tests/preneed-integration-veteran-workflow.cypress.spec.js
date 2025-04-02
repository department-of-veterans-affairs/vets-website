/* eslint-disable @department-of-veterans-affairs/axe-check-required */
// axe checks are called in the helper file for all pages
import preneedHelpers from './utils/cypress-preneed-integration-helpers';
import testData from './fixtures/data/veteran-test.json';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;

describe('Pre-need form VA 40-10007 Veteran Workflow', () => {
  // will add back in once URL is updated
  it.skip('fills the form and navigates accordingly as a veteran', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.invalidAddressIntercept();
    preneedHelpers.visitIntro();

    // Preparer Information
    preneedHelpers.fillPreparerInfo(applicant);

    // Applicant Information
    preneedHelpers.validateProgressBar('2');
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
      claimant.phoneNumber,
      claimant.email,
    );

    // Applicant Demographics
    preneedHelpers.fillVeteranDemographics(veteran);

    // Military History
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillMilitaryHistory(
      veteran.militaryStatus,
      veteran.militaryServiceNumber,
      veteran.vaClaimNumber,
    );

    // Previous Names
    preneedHelpers.fillPreviousName(veteran);

    // Service Periods
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.fillServicePeriods(veteran.serviceRecords);

    // Previously Buried Person(s)
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillBenefitSelection(
      claimant.desiredCemetery,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.clickContinue();

    // Review/Submit
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.submitForm();
  });
});
