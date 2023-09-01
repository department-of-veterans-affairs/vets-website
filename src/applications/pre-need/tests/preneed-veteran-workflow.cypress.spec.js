import Timeouts from 'platform/testing/e2e/timeouts';
import testData from './schema/maximal-test.json';
import preneedHelpers from './utils/cypress-preneed-helpers';

describe('Pre-need form VA 40-10007 Veteran Workflow', () => {
  it('fills the form and navigates accordingly as a veteran', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Applicant Information
    preneedHelpers.fillApplicantInfo(
      testData.data.application.veteran.currentName,
      testData.data.application.veteran.ssn,
      testData.data.application.veteran.dateOfBirth,
      testData.data.application.veteran.relationshipToVet,
    );

    // Veteran Information
    cy.get('input[name="root_application_veteran_militaryServiceNumber"]');
    preneedHelpers.validateProgressBar('1');

    cy.fill(
      'input[name="root_application_veteran_militaryServiceNumber"]',
      testData.data.application.veteran.militaryServiceNumber,
    );
    cy.fill(
      'input[name="root_application_veteran_vaClaimNumber"]',
      testData.data.application.veteran.vaClaimNumber,
    );
    cy.fill(
      'input[name="root_application_veteran_placeOfBirth"]',
      testData.data.application.veteran.placeOfBirth,
    );
    cy.get(
      'input[name="root_application_veteran_race_isSpanishHispanicLatino"]',
    ).click();
    cy.selectRadio(
      'root_application_veteran_gender',
      testData.data.application.veteran.gender,
    );
    cy.selectRadio(
      'root_application_veteran_maritalStatus',
      testData.data.application.veteran.maritalStatus,
    );
    cy.get('#root_application_veteran_militaryStatus').select(
      testData.data.application.veteran.militaryStatus,
    );

    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/veteran-information');

    // Military History
    cy.get(
      'input[name="root_application_veteran_serviceRecords_0_serviceBranch"]',
      { timeout: Timeouts.verySlow },
    );
    preneedHelpers.validateProgressBar('2');
    preneedHelpers.fillMilitaryHistory(
      testData.data.application.veteran.serviceRecords,
    );
    cy.url().should('not.contain', '/applicant-military-history');

    // Previous Names page
    preneedHelpers.fillPreviousName(
      testData.data.application.veteran.serviceName,
    );
    cy.url().should('not.contain', '/applicant-military-name');

    // Benefit Selection page
    cy.get('label[for="root_application_claimant_desiredCemetery"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.veteran.desiredCemetery.label,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents page
    cy.get('label[for="root_application_preneedAttachments"]');
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Veteran Contact Information page
    cy.get('select[name="root_application_claimant_address_country"]');
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillApplicantContactInfo(testData.data.application.veteran);

    // Preparer Contact Information page
    cy.get(
      'label[for="root_application_applicant_applicantRelationshipToClaimant_1"]',
    );
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillPreparerInfo(testData.data.application.applicantForeign);

    // Review/Submit Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.submitForm();
  });
});
